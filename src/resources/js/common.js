// 파라미터
const body = document.querySelector("body");
body.classList.add(theme);
var type=getParam('type');
var theme = getParam('theme');
function getParam(str) {
	var param=window.location.search.substring(1).split('&'), val;
	for(var i=0;i<param.length;i++){
		val=param[i].split("=");
		if(val[0]==str){
			return val[1];
		}
	}
	return null;
}
document.addEventListener('DOMContentLoaded', function () {
	// 파비콘 경로 변경
	function changeFavicon(src) {
		var links = document.querySelectorAll('link[rel*="icon"]');
		links.forEach((link) => link.parentNode.removeChild(link));
		var newLink = document.createElement('link');
		newLink.rel = 'shortcut icon';
		newLink.href = src;
		document.head.appendChild(newLink);
	}
	if (theme == 'tmon') {
		// 파비콘 변경
		changeFavicon('https://image.wemakeprice.com/images/culture/m/common/faviconTmon.ico');
		// title 태그 문구 변경
		document.title = document.title.replace('위메프', '티몬');
		// 헤더 문구 수정
		const headerElement = document.querySelector('#header');
		if (headerElement && headerElement.classList.contains('main_header')) {
			const headerTitle = headerElement.querySelector('h2');
			if (headerTitle) {
					headerTitle.textContent = 'T공연티켓';
			}
		}
		// 에러페이지 copyright
		if (document.querySelector('.copyright')){
			document.querySelector('.copyright').textContent = 'COPYRIGHT. TMON INC. ALL RIGHTS RESERVED.';
		};
	}
  // [위메프/티몬] 마이페이지 > 유의사항 및 티켓반환주소
  var currentPage = window.location.pathname;
  $('#detailListTip').load('components/detailListTip.html', function (response, status, xhr) {
  if (status == 'error') {
      // console.error('로드 에러 components/detailListTip.html: ' + xhr.status + ' ' + xhr.statusText);
      } else {
          // console.log('components/detailListTip.html 로드 성공');
          document.querySelector('[data-theme="txtPostBoxCancel"]').style.display = 'none';
          var txtPostBoxCancel = document.querySelector('[data-theme="txtPostBoxCancel"]');
          txtPostBoxCancel.style.display = 'block';
          // 티몬일 경우
          if (theme == 'tmon') {
              // 유의사항 문구 수정
              const listTip = document.querySelectorAll('#detailListTip li[data-theme="txtNotice"]');
              if (listTip.length > 0) {
                  listTip[0].innerText = "예매취소는 '마이페이지 > 공연티켓 예매확인/취소'에서 직접취소 또는 전화(티몬 고객센터 1644-0230)로 가능합니다.";
                  listTip[1].innerText = '수령하신 티켓을 취소마감시간 이전까지 티몬 고객센터로 반환해주셔야 환불이 가능하며, 도착한 일자 기준으로 취소수수료가 부과됩니다. (단, 티몬 고객센터 운영시간-평일 9:00~18:00)';
              }
              if (txtPostBoxCancel) {
              txtPostBoxCancel.innerHTML = '[06028] 서울 강남구 압구정로 118 <br>아리지빌딩 공연티켓 취소 담당자';
              }
          }
      }
  });
});
