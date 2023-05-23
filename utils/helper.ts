import fs from 'fs';
import * as path from 'path';

export const writeRecursive = (fileList, writeStream) => {
  if (fileList.length) {
    const filePath = fileList.shift();
    const rs = fs.createReadStream(filePath);
    rs.pipe(writeStream, { end: false });
    rs.on('end', () => {
      writeRecursive(fileList, writeStream);
    });
  } else {
    writeStream.end();
  }
};

export const deleteAfterMerge = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((filename) => {
      const filePath = path.join(dirPath, filename);
      const fileStatus = fs.statSync(filePath);
      if (fileStatus.isDirectory()) {
        deleteAfterMerge(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dirPath);
  } else {
    console.log('dic not exist');
  }
};
