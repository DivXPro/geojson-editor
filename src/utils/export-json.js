export default function exportJson(data, type = 'application/json') {
  const blob = new Blob([data], { type });
  // const reader = new FileReader();
  // reader.onload = e => {
  //   const res = e.target.result;
  //   try {
  //     const json = JSON.parse(res)
  //     if (json) {
  //       return;
  //     }
  //   } catch (err) {
  //     //
  //   }
  // }
  // reader.readAsText(jsonBlob);

  // 兼容不同浏览器的URL对象
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    window.navigator.msSaveOrOpenBlob(blob, 'map.geojson');
  } else {
    const url = window.URL || window.webkitURL || window.moxURL
    // 创建下载链接
    const downloadHref = url.createObjectURL(blob);
    // 创建a标签并为其添加属性
    let downloadLink = document.createElement('a')
    downloadLink.href = downloadHref
    downloadLink.download = 'map.geojson';
    // 触发点击事件执行下载
    downloadLink.click();
  }
}