const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

/**
 * @param gulp
 * @param $
 * @param config
 */
module.exports = (gulp, $, config) => {
  function generateSCSSFromImages(baseImagePath, baseSassPath) {
    // console.log(`이미지 경로 확인: ${baseImagePath}`);

    fs.readdir(baseImagePath, { withFileTypes: true }, (err, directories) => {
      if (err) {
        console.error(`디렉토리 확인 실패: ${baseImagePath} - ${err}`);
        return;
      }
      directories.forEach(directory => {
        if (directory.isDirectory()) {
          const directoryPath = path.join(baseImagePath, directory.name);
          // console.log(`디렉토리 처리: ${directory.name} 위치: ${directoryPath}`);

          fs.readdir(directoryPath, { withFileTypes: true }, (fileErr, files) => {
            if (fileErr) {
              console.error(`디렉토리 파일 읽기 오류 (${directory.name}) 위치: ${directoryPath}: ${fileErr}`);
              return;
            }
            // png 파일
            const validFiles = files.filter(file => file.isFile() && !file.name.startsWith('.') && (path.extname(file.name).toLowerCase() === '.png' || path.extname(file.name).toLowerCase() === '.gif'));
            const entries = validFiles.map(file => `  ${file.name.replace(path.extname(file.name), '').replace(/-/g, '_')}: '${file.name}'`).join(',\n');

            // SCSS 생성
            if (entries.length > 0) {
              const sassContent = `$${directory.name.replace(/-/g, '_')}: (\n${entries}\n);\n`;
              // SCSS 파일을 저장 디렉토리 생성
              fs.mkdir(baseSassPath, { recursive: true }, (dirErr) => {
                if (dirErr) {
                  console.error(`디렉토리 생성 실패: ${baseSassPath}: ${dirErr}`);
                  return;
                }
                const sassFilePath = path.join(baseSassPath, `_${directory.name}.scss`);
                // SCSS 파일 작성
                fs.writeFile(sassFilePath, sassContent, { flag: 'w' }, (writeErr) => {
                  if (writeErr) {
                    console.error(`SCSS 파일 작성 실패: ${sassFilePath}: ${writeErr}`);
                  } else {
                    // console.log(`SCSS 파일 작성 성공: ${directory.name} 위치: ${sassFilePath}`);
                  }
                });
              });
            } else {
              console.log(`이미지 없음: ${directory.name}`);
            }
          });
        }
      });
    });
  }

  function mSprImg(done) {
    const { src, dest } = config.mSprImg;
    generateSCSSFromImages(src[0], dest);
    done();
  }
  function pcSprImg(done) {
    const { src, dest } = config.pcSprImgFront;
    generateSCSSFromImages(src[0], dest);
    done();
  }
	gulp.task(mSprImg);
	gulp.task(pcSprImg);

  gulp.task('sprImgGenerate', gulp.series('sprImgClean', 'mSprImg', 'pcSprImg'))
}
