import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


$(document).ready(function () {
                $('th').each(function (col) {
                    $(this).hover(
                            function () {
                                $(this).addClass('focus');
                            },
                            function () {
                                $(this).removeClass('focus');
                            }
                    );
                    $(this).click(function () {
                        if ($(this).is('.asc')) {
                            $(this).removeClass('asc');
                            $(this).addClass('desc selected');
                            sortOrder = -1;
                        } else {
                            $(this).addClass('asc selected');
                            $(this).removeClass('desc');
                            sortOrder = 1;
                        }
                        $(this).siblings().removeClass('asc selected');
                        $(this).siblings().removeClass('desc selected');
                        var arrData = $('table').find('tbody >tr:has(td)').get();
                        arrData.sort(function (a, b) {
                            var val1 = ($(a).children('td').eq(col).text().toUpperCase()).replace(/,/g, '');
                            var val2 = ($(b).children('td').eq(col).text().toUpperCase()).replace(/,/g, '');
                            if ($.isNumeric(val1) && $.isNumeric(val2))
                                return sortOrder == 1 ? val1 - val2 : val2 - val1;
                            else
                                return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
                        });
                        $.each(arrData, function (index, row) {
                            $('tbody').append(row);
                        });
                    });
                });
            });
