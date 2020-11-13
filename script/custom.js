$(function(){
    //main.html scroll bar
    function scroll(ME){
        let hey=ME.getBoundingClientRect().height()
        console.log(hey);
    };
    //search-city
    var key = '';
    $('#search-city').focus(function(){
        $(this).css('width', '195px').css('left','150px');
        $('header .material-icons').css('left','10px');
    });
    $('#search-city').blur(function(){
        if($(this).val() == ''){
           $(this).css('width','50px').css('left','');
           $('header .material-icons').css('left','');
        }
    });
    
    $('#search-city').on('keypress', function(e){
        if(e.which ==13 && !e.shiftKey){
            key = $(this).val();
            $(this).val('');
            $(this).css('width','50px').css('left','');
            $('header .material-icons').css('left','');
            getPos('','',key);    
        }
    });
    
    
    //한글입력 금지
    $('#search-city').on('blur keyup', function(e){
        $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,'')); 
    });
    
    //위도,경도 확인
    if(key==''){
        var myLat = 37.6363666, myLng = 126.6391851;
        if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(function(position){
               myLat = position.coords.latitude;
               myLng = position.coords.longitude;      
               getPos(myLat, myLng, ''); 
        },
         function (err){
           if(err.code == 1){
              console.log('에러발생');   
           }
         });
       }
    }

    //ajax

    function getPos(lat, lon, city){
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast";
    var apikey = '61817fe9871c5ce196a7b67a92ce3a6b';
    let weeks=['일','월','화','수','목','금','토'];
    if(city==''){
      var dataList = {    
          lat: lat,
          lon: lon,
          appid: apikey,
          units: 'metric',
          lang: 'kr'
      };
    }else{
       var dataList = {
           q: city,
           appid: apikey,
           units: 'metric',
           lang: 'kr'
       }    
    }
    
       $.ajax({
               url: apiUrl, 
               dataType: 'json', 
               type: 'GET', 
               data: dataList, 
               success:function(rs){
                let date=new Date(Number(rs.list[0].dt)*1000);
                let sunrise=new Date(Number(rs.city.sunrise)*1000);
                let sunset=new Date(Number(rs.city.sunset)*1000);
                //let year=date.getFullYear();
                let month=date.getMonth()+1;
                let day=date.getDate();
                let week=weeks[date.getDay()];
                let nDate=month+'월 '+day+'일 ('+week+'요일)';
                let overcast=rs.list[0].weather[0].description;
                $('.w-date').text(nDate);
                //$('.city').text(rs.city.name);
                let city=rs.city.name;
                let aCity=city.split('-');
                $('.city').text(aCity[0]);
                $('.temp').text(rs.list[0].main.temp+'ºC');
                $('.weather').text(rs.list[0].weather[0].main);
                let img_weather=getWeater(rs.list[0].weather[0].icon);
                $('.today-wather img').attr('src','images/'+img_weather[0]+'.png');
                $('.today-wather').css('background-image','url('+img_weather[1]+')');
                $('.overcast').text(overcast);
                $('.feels_like').text(rs.list[0].main.feels_like);
                $('.temp_min').text(' '+rs.list[0].main.temp_min+'ºC');
                $('.temp_max').text(' '+rs.list[0].main.temp_min+'ºC');
                $('.humidity').text(' '+rs.list[0].main.humidity);
                $('.wind').text(' '+rs.list[0].wind.speed);
                $('.sunrise').text(sunrise.getHours()+"시 "+sunrise.getMinutes()+"분");
                $('.sunset').text(sunset.getHours()+"시 "+sunset.getMinutes()+"분");
                if(overcast.indexOf('구름')>=0){
                    $('.today-wather img').attr('src','images/02n.png');
                }
               /*
               var utime = Number(rs.list[0].dt)*1000;
               var date = new Date(utime);
               var year = date.getFullYear());
               var month
               var day
               var week
                */ 
               let ArrayHtml=new Array(); 
               for(let i=0;i<40;i++){ 
                   let dt=new Date(Number(rs.list[i].dt)*1000);
                   let listDay=dt.getDate();
                   let listWeek=weeks[dt.getDay()];
                   let listTime=dt.getHours();
                   let img_weather=getWeater(rs.list[i].weather[0].icon);
                   if(listTime<=12){
                    listTime='오전 '+listTime+'시';
                   }else{
                    listTime='오후 '+(listTime-12)+'시';
                   }
                       ArrayHtml[i]='<div class="five-temp">'+
                    '<div class="five-date">'+
                    '<span class="five-date">'+listDay+'</span>'+
                    '<span class="five-week">'+listWeek+'</span>'+
                    '</div>'+
                    '<div class="five-time">'+
                    listTime+
                    '</div>'+
                    '<h1 class="f-weather"><i class="wi '+img_weather[2]+'"></i></h1>'+
                    '<p class="f-temp">'+rs.list[i].main.temp+'ºC</p>'+
                    '</div>';        
               }
              $('.five-weather').html(ArrayHtml.join('')).promise().done(function(){
                  myslick();
              });
              }
       });

    }
    
    
    //slick
    function myslick(){
    $('.five-weather').slick({
        prevArrow: false,
        nextArrow: false,
        variableWidth: true,
        infinite: false,
        slidesToShow: 1
    });
    }
//get weather
function getWeater(ic){
    let img,bg,icon;
    switch (ic){
        case '01d':
        img='01d';
        bg='images/color/day.png';
        icon='wi-day-sunny';
        break;
        case '01n':
            img='01n';
            bg='images/color/night.png';
            icon='wi-night-clear';
        break;
        case '02d':
            img='02d';
            bg='images/color/cloudy.png';
            icon='wi-day-cloudy';
        break;
        case '02n':
            img='02n';
            bg='images/color/cloudy-night.png';
            icon='wi-night-cloudy';
        break;
        case '03d':
            img='03d';
            bg='images/color/cloudy.png';
            icon='wi-cloudy';
        break;
        case '03n':
            img='03n';
            bg='images/color/cloudy-night.png';
            icon='wi-cloudy';
        break;
        case '04d':
            img='04d';
            bg='images/color/cloudy.png';
            icon='wi-cloudy';
        break;
        case '04n':
            img='04n';
            bg='images/color/cloudy-night.png';
            icon='wi-cloudy';
        break;
        case '09d':
            img='09d';
            bg='images/color/rain.png';
            icon='wi-day-hail';
        break;
        case '09n':
            img='09n';
            bg='images/color/rain-night.png';
            icon='wi-night-alt-rain';
        break;
        case '10d':
            img='10d';
            bg='images/color/rain.png';
            icon='wi-day-hail';
        break;
        case '10n':
            img='10n';
            bg='images/color/rain-night.png';
            icon='wi-night-alt-rain';
        break;
        case '11d':
            img='11d';
            bg='images/color/rain.png';
            icon='wi-day-lightning';
        break;
        case '11n':
            img='11n'; 
            bg='images/color/rain-night.png';
            icon='wi-night-alt-lightning';
        break;
        case '13d':
            img='13d';
            bg='images/color/snow.png';
            icon='wi-day-snow';
        break;
        case '13n':
            img='13n';
            bg='images/color/snow-night.png';
            icon='wi-night-alt-snow';
        break;
        case '50d':
            img='50d';
            bg='winter';
            icon='wi-day-fog';
        break;
        case '50n':
            img='50n';
            bg='winter';
            icon='wi-night-fog';
        break;        
    }
    let ndt=new Array(img,bg,icon);
    return ndt;
}
   
 
});