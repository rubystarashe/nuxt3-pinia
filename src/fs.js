import fs from 'fs'

export const getFileList = (path = __dirname, extension) => {
  const regex = new RegExp(`(.${extension})$`)
  const files = fs.readdirSync(path).filter(file => {
    return fs.statSync(`${path}/${file}`).isFile() && (extension ? regex.test(file) : true)
  }).map(e => e.replace(regex, ''))
  return files
}

export const getFolderList = path => fs.readdirSync(path).filter(file => {
  return fs.statSync(`${path}/${file}`).isDirectory()
})

export const getAllFileList = (path, extension) => {
  if (!fs.existsSync(path)) return []
  
  let list = [ ...getFileList(path, extension) ]

  const loopGetFile = (path, dir = '') => {
    getFolderList(path).forEach(folder => {
      if (!/pinel\/mods/g.test(path)) {
        const newPath = path + '/' + folder
        const newDir = dir + '/' + folder
        list = [ ...list, ...getFileList(newPath, extension).map(fileName => (newDir + '/' + fileName).replace('/', '')) ]
        loopGetFile(newPath, newDir)
      }
    })
  }
  loopGetFile(path)

  return list
}
