/* global google:true */
/* global moment:true */
/* global AmCharts:true */
/* jshint unused:false */
/* jshint camelcase: false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(36, -86, 4);
    $('#add').click(addLocation);
  }

  function addLocation(){
    var zip = $('#zip').val().trim();
    var url = 'http://api.wunderground.com/api/6a50cc2bf300d4db/conditions/q/'+zip+'.json?callback=?';
    $.getJSON(url, data=>{
      addMarker(data);
    });
    url = 'http://api.wunderground.com/api/6a50cc2bf300d4db/forecast10day/q/'+zip+'.json?callback=?';
    $.getJSON(url, data=>{
      let forecastObjs = data.forecast.simpleforecast.forecastday.map(processForecast);
      makeChart(forecastObjs, zip);
    });
  }

  function processForecast(day){
    let high = day.high.fahrenheit*1;
    let low = day.low.fahrenheit*1;
    let date = `${day.date.day}/${day.date.month}/${day.date.year}`;
    return {'date':date, 'high':high, 'low':low};
  }

  function addMarker(data){
    let latLng = new google.maps.LatLng(data.current_observation.display_location.latitude, data.current_observation.display_location.longitude);
    let marker = new google.maps.Marker({map:map, position: latLng, title: data.current_observation.display_location.city});
  }

  var map;

  function initMap(lat, lng, zoom){
    let styles = [{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'labels.text','stylers':[{'visibility':'off'}]}];
    let mapOptions = {center: new google.maps.LatLng(lat,lng), zoom:zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function makeChart(data, zip){
    let numCharts = $('.chart').length;
    let chartId = 'chart-' + (numCharts+1);
    let $newChartDiv = $('<div>').addClass('chart').attr('id', chartId);
    $('#right-col').append($newChartDiv);
    var chart = AmCharts.makeChart(chartId, {
        'type': 'serial',
        'theme': 'none',
        'pathToImages': 'http://www.amcharts.com/lib/3/images/',
        'legend': {
            'useGraphSettings': true
        },
        'titles':[{
          'text':zip,
          'size': 15
        }],
        'dataProvider': data,
        'valueAxes': [{
            'id':'v1',
            'axisColor': '#FF6600',
            'axisThickness': 2,
            'gridAlpha': 0,
            'axisAlpha': 1,
            'minimum': -15,
            'maximum': 120,
            'position': 'left'
        }],
        'graphs': [{
            'valueAxis': 'v1',
            'lineColor': '#FF6600',
            'bullet': 'round',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'High Temp',
            'valueField': 'high',
    		    'fillAlphas': 0
        }, {
            'valueAxis': 'v1',
            'lineColor': '#FCD202',
            'bullet': 'square',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'Low Temp',
            'valueField': 'low',
    		    'fillAlphas': 0
        }],
        'chartCursor': {
            'cursorPosition': 'mouse'
        },
        'categoryField': 'date',
        'categoryAxis': {
            'axisColor': '#DADADA',
            'minorGridEnabled': true
        }
    });
  }
})();
