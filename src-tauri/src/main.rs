// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::{Path, PathBuf};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, AboutMetadata};

#[tauri::command]
fn read_dir(path: String) -> Result<Vec<FileEntry>, String> {
    fn read_dir_recursive(base_path: &Path) -> Result<Vec<FileEntry>, String> {
        let mut files = Vec::new();
        
        for entry in fs::read_dir(base_path).map_err(|e| e.to_string())? {
            if let Ok(entry) = entry {
                let path = entry.path();
                
                // 直接使用完整路径，不做任何转换
                if let Ok(metadata) = entry.metadata() {
                    if metadata.is_dir() {
                        files.extend(read_dir_recursive(&path)?);
                    } else {
                        let file_entry = FileEntry {
                            name: path.file_name()
                                .unwrap_or_default()
                                .to_string_lossy()
                                .to_string(),
                            // 保存完整的原始路径
                            path: path.parent()
                                .map(|p| p.to_string_lossy().to_string())
                                .unwrap_or_default(),
                            is_dir: false,
                            size: metadata.len(),
                            modified_at: metadata.modified()
                                .ok()
                                .map(|t| t.duration_since(std::time::UNIX_EPOCH)
                                    .unwrap_or_default()
                                    .as_millis() as i64),
                        };
                        files.push(file_entry);
                    }
                }
            }
        }
        Ok(files)
    }
    
    let base_path = PathBuf::from(path);
    read_dir_recursive(&base_path)
}

#[tauri::command]
async fn rename_file(old_path: String, new_name: String) -> Result<(), String> {
    // println!("\n开始重命名操作:");
    // println!("原始路径: {}", old_path);
    // println!("新文件名: {}", new_name);
    
    let old_path = PathBuf::from(&old_path);
    
    // 检查文件是否存在，不使用 canonicalize
    if !old_path.exists() {
        return Err(format!("源文件不存在: {}", old_path.display()));
    }
    
    let parent = old_path.parent()
        .ok_or_else(|| format!("无法获取父目录: {}", old_path.display()))?;
    let new_path = parent.join(new_name);
    
    // println!("目标路径: {}", new_path.display());

    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("重命名失败: {} -> {}, 错误: {}", 
            old_path.display(), 
            new_path.display(), 
            e))?;
    
    // println!("重命名成功!");
    Ok(())
}

#[tauri::command]
async fn undo_rename(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(new_path, old_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn get_file_metadata(path: String) -> Result<FileMetadata, String> {
    match std::fs::metadata(path) {
        Ok(metadata) => Ok(FileMetadata {
            size: metadata.len(),
            modified_at: metadata.modified()
                .ok()
                .and_then(|time| time.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|duration| duration.as_millis())
                .unwrap_or(0),
        }),
        Err(e) => Err(e.to_string()),
    }
}

#[derive(serde::Serialize, Debug)]
struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    modified_at: Option<i64>,
}

#[derive(serde::Serialize)]
struct FileMetadata {
    size: u64,
    modified_at: u128,
}

fn main() {
    // EasyRename 菜单
    let app_menu = Submenu::new(
        "EasyRename",
        Menu::new()
            .add_native_item(MenuItem::About(
                "EasyRename".to_string(),
                AboutMetadata::new()
                    .version("v0.1.0")
                    .authors(vec!["EasyRename Team".to_string()])
                    .comments("专业的文件批量重命名工具")
                    .copyright("© 2024 EasyRename")
                    .license("MIT")
            ))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("preferences", "偏好设置...").accelerator("cmd+,"))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    );

    // 文件菜单
    let file_menu = Submenu::new(
        "文件",
        Menu::new()
            .add_item(CustomMenuItem::new("import_folder", "导入文件夹...").accelerator("cmd+o"))
            .add_item(CustomMenuItem::new("import_files", "导入文件...").accelerator("cmd+shift+o"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("select_all", "全选").accelerator("cmd+a"))
            .add_item(CustomMenuItem::new("deselect_all", "取消全选").accelerator("cmd+d"))
            .add_item(CustomMenuItem::new("remove_selected", "删除选中").accelerator("cmd+backspace"))
            .add_item(CustomMenuItem::new("clear_all", "清空列表").accelerator("cmd+shift+backspace"))
    );

    // 视图菜单
    let view_menu = Submenu::new(
        "视图",
        Menu::new()
            .add_item(CustomMenuItem::new("preview_mode", "仅显示预览"))
            .add_item(CustomMenuItem::new("affected_mode", "仅显示受影响文件"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("toggle_path", "显示/隐藏目录").accelerator("cmd+p"))
    );

    // 操作菜单
    let operation_menu = Submenu::new(
        "操作",
        Menu::new()
            .add_item(CustomMenuItem::new("execute", "执行重命名").accelerator("cmd+enter"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("undo", "撤销").accelerator("cmd+z"))
            .add_item(CustomMenuItem::new("redo", "重做").accelerator("cmd+shift+z"))
    );

    // 帮助菜单
    let help_menu = Submenu::new(
        "帮助",
        Menu::new()
            .add_item(CustomMenuItem::new("documentation", "使用文档"))
            .add_item(CustomMenuItem::new("check_updates", "检查更新..."))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("feedback", "反馈问题"))
            .add_item(CustomMenuItem::new("about", "关于 EasyRename"))
    );

    let menu = Menu::new()
        .add_submenu(app_menu)
        .add_submenu(file_menu)
        .add_submenu(view_menu)
        .add_submenu(operation_menu)
        .add_submenu(help_menu);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                // 文件操作
                "import_folder" => {
                    event.window().emit("menu-import-folder", ()).unwrap();
                }
                "import_files" => {
                    event.window().emit("menu-import-files", ()).unwrap();
                }
                "select_all" => {
                    event.window().emit("menu-select-all", ()).unwrap();
                }
                "deselect_all" => {
                    event.window().emit("menu-deselect-all", ()).unwrap();
                }
                "remove_selected" => {
                    event.window().emit("menu-remove-selected", ()).unwrap();
                }
                "clear_all" => {
                    event.window().emit("menu-clear-all", ()).unwrap();
                }
                
                // 视图操作
                "preview_mode" => {
                    event.window().emit("menu-preview-mode", ()).unwrap();
                }
                "affected_mode" => {
                    event.window().emit("menu-affected-mode", ()).unwrap();
                }
                "toggle_path" => {
                    event.window().emit("menu-toggle-path", ()).unwrap();
                }
                
                // 重命名操作
                "execute" => {
                    event.window().emit("menu-execute", ()).unwrap();
                }
                "undo" => {
                    event.window().emit("menu-undo", ()).unwrap();
                }
                "redo" => {
                    event.window().emit("menu-redo", ()).unwrap();
                }
                
                // 其他操作
                "preferences" => {
                    event.window().emit("menu-preferences", ()).unwrap();
                }
                "documentation" => {
                    event.window().emit("menu-documentation", ()).unwrap();
                }
                "check_updates" => {
                    event.window().emit("menu-check-updates", ()).unwrap();
                }
                "feedback" => {
                    event.window().emit("menu-feedback", ()).unwrap();
                }
                "about" => {
                    event.window().emit("menu-about", ()).unwrap();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            read_dir,
            rename_file,
            undo_rename,
            get_file_metadata
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
