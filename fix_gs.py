import os

for f in os.listdir('.'):
  if f.endswith('.gs'):
    with open(f, 'r', encoding='utf-8') as file:
      content = file.read()
    
    # Replace for ssClass
    content = content.replace("getSheetByName('Mã Giáo viên') || ssClass.getSheetByName('Mã giáo viên')", "getSheetByName('Mã Giáo viên') || ssClass.getSheetByName('Mã giáo viên') || ssClass.getSheetByName('Mã gia sư')")
    
    # Replace for ss
    content = content.replace("getSheetByName('Mã Giáo viên') || ss.getSheetByName('Mã giáo viên')", "getSheetByName('Mã Giáo viên') || ss.getSheetByName('Mã giáo viên') || ss.getSheetByName('Mã gia sư')")
    
    # Replace for Main.gs and others using Mã gia sư directly
    content = content.replace("ssMain.getSheetByName('Mã gia sư')", "(ssMain.getSheetByName('Mã Giáo viên') || ssMain.getSheetByName('Mã giáo viên') || ssMain.getSheetByName('Mã gia sư'))")
    
    with open(f, 'w', encoding='utf-8') as file:
      file.write(content)

print("Done")
