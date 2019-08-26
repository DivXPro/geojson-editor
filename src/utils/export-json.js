export default function exportJson(filename = 'map.geojson', data, type = 'application/json') {
  const blob = new Blob([data], { type });

  // 兼容不同浏览器的URL对象
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const url = window.URL || window.webkitURL || window.moxURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(blob);
    // 创建a标签并为其添加属性
    let downloadLink = document.createElement('a');
    downloadLink.href = downloadHref;
    downloadLink.download = filename;
    // 触发点击事件执行下载
    downloadLink.click();
  }
}

export function exportFile(filename, content) {
  // 兼容不同浏览器的URL对象
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    window.navigator.msSaveOrOpenBlob(content, filename);
  } else {
    const url = window.URL || window.webkitURL || window.moxURL;
    // 创建下载链接
    const downloadHref = url.createObjectURL(content);
    // 创建a标签并为其添加属性
    let downloadLink = document.createElement('a');
    downloadLink.href = downloadHref;
    downloadLink.download = filename;
    // 触发点击事件执行下载
    downloadLink.click();
  }
}