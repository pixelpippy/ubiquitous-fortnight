#!/usr/bin/env python3
import os
import glob

# 找到所有 markdown 文件
md_files = glob.glob('/workspaces/ubiquitous-fortnight/vitepress-project/docs/**/*.md', recursive=True)

for filepath in md_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否有 /images/ 的引用
    if '/images/' in content:
        # 替换所有 /images/ 为 ./images/
        new_content = content.replace('/images/', './images/')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ 已修复: {filepath}")

print("\n✅ 所有 markdown 文件中的图片路径已修复")
