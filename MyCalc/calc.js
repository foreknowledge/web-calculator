$(document).ready(function () {
    var parser = math.parser();

    var prevTagId;
    var preValue = ''; var preResult = '';
    var preValues = []; var preResults = [];
    var displayValue = '0'; var resultValue = '';
    var afterEXE = false;
    var copyString = ''; var copied = false;
    var is_input = -1; var flag = 0;
    var dict = {};
    
    $('#input').val(displayValue);

    $('.key').each(function (index, key) {
        $(this).click(function (e) {
            if (displayValue == '0') displayValue = '';

            var textVal = $(this).text();
            if (textVal == 'EXE') {
                try {
                    while (preValues.length > 0 &&
                        preValues[preValues.length - 1] != preValue) {
                        preValues.pop();
                        preResults.pop();
                    }

                    preValue = displayValue;
                    preValues.push(preValue);
                    var Functions = displayValue;
                    displayValue = parser.eval(displayValue).toString();
                    var tokens = displayValue.split(' ');
                    if (tokens[0] == 'function'){
                        var splits = Functions.split("=");
                        dict[splits[0]] = splits[1];

                        displayValue = "Saved.";
                        var elements = document.getElementsByClassName('func_key');
                        for(var i = 0; i < 12; i++)
                            if($(elements[i]).text() == splits[0].split("(")[0]){
                                $(elements[i]).addClass('func_key_available');
                                break;
                            }
                    }

                    preResult = displayValue;
                    preResults.push(preResult);
                    $('#result').val(displayValue);
                    displayValue = '0'; resultValue = '';

                    afterEXE = true;
                }
                catch (e) {
                    preValue = displayValue;
                    displayValue = '0';
                    if (displayValue != 'function')
                        $('#result').val(e);

                    preResult = '';
                }
            }
            else if ($(this).hasClass('folder')) {
                var tagId;
                if (textVal == '삼각')
                    tagId = '#TriFunc';
                else if (textVal == '벡터행렬')
                    tagId = '#VecMat';
                else if (textVal == '확률')
                    tagId = '#Percent';
                else if (textVal == '통계')
                    tagId = '#Statistics';
                else if (textVal == '함수')
                    tagId = '#Func';
                else if (textVal == '변수')
                    tagId = '#Var';
                else if (textVal == '논리연산')
                    tagId = '#LogicOp';
                else if (textVal == '비트연산')
                    tagId = '#BitOp';

                if (prevTagId != tagId)
                    $(prevTagId).hide();

                $(tagId).toggle();
                prevTagId = tagId;
            }
            else if (textVal == 'COPY') {
                if (is_input == 1)
                    copyString = preResult;
                else if (is_input == 0)
                    copyString = preValue;
                
                copied = true;
                $(this).css('background-color', '#c6ff3b');
                $(this).css('color', 'gray');
                is_input = -1;
            }
            else if (textVal == 'SHIFT') {
                if ($('.alpha').attr('id') == 'alpha-on') {
                    $('.alpha').attr('id', 'alpha-off');
                    $('.alpha').removeClass('clicked');
                    AlphaOff();
                }

                if ($(this).attr('id') == 'shift-off') {
                    $(this).attr('id', 'shift-on');
                    $(this).addClass('clicked');
                    ShiftON();
                }
                else if ($(this).attr('id') == 'shift-on') {
                    $(this).attr('id', 'shift-off');
                    $(this).removeClass('clicked');
                    ShiftOff();
                }
            }
            else if (textVal == 'ALPHA') {
                if ($('.shift').attr('id') == 'shift-on') {
                    $('.shift').attr('id', 'shift-off');
                    $('.shift').removeClass('clicked');
                    ShiftOff();
                }

                if ($(this).attr('id') == 'alpha-off') {
                    $(this).attr('id', 'alpha-on');
                    $(this).addClass('clicked');
                    AlphaON();
                }
                else if ($(this).attr('id') == 'alpha-on') {
                    $(this).attr('id', 'alpha-off');
                    $(this).removeClass('clicked');
                    AlphaOff();
                }
            }
            else if (textVal == '◀◀') {
                displayValue = '';
                if (preValues.indexOf(preValue) > 0) {
                    preValue = preValues[preValues.indexOf(preValue) - 1];
                    preResult = preResults[preResults.indexOf(preResult) - 1];
                    $('#input').val(preValue);
                    $('#result').val(preResult);
                }
            }
            else if (textVal == '▶▶') {
                displayValue = '';
                if (preValues.indexOf(preValue) < preValues.length - 1) {
                    preValue = preValues[preValues.indexOf(preValue) + 1];
                    preResult = preResults[preResults.indexOf(preResult) + 1];
                    $('#input').val(preValue);
                    $('#result').val(preResult);
                }
            }
            else if (afterEXE && ($(this).hasClass('operator')
                || $(this).hasClass('semi-operator'))) {
                var arrOper = ['+', '-', '*', '/', '%', '^', '!', '&', '|',
                    '<<', '>>'];

                if ($.inArray(textVal, arrOper) != -1)
                    displayValue = preResult + textVal;
                else if (textVal == '~')
                    displayValue = textVal + preResult;
                else if (textVal == 'n!')
                    displayValue = preResult + '!';
                else if (textVal == '+/-') {
                    if (preResult[0] != '-')
                        displayValue = '-' + preResult;
                    else
                        displayValue = preResult.slice(1, );
                }

                $('#input').val(displayValue);
                $('#result').val('');
                afterEXE = false;
            }
            else {
                if (textVal == 'AC') {
                    displayValue = '0';
                    resultValue = '';
                }
                else if (textVal == 'DEL') {
                    if (afterEXE)
                        displayValue = preValue.slice(0, -1);
                    else
                        displayValue = displayValue.slice(0, -1);
                }
                else if (textVal == '+/-') {
                    if (displayValue[0] != '-')
                        displayValue = '-' + displayValue;
                    else
                        displayValue = displayValue.slice(1, );
                }
                else if (textVal == 'PASTE') {
                    if (copied)
                        displayValue += copyString;
                }
                else if (textVal == 'n!')
                    displayValue += '!';
                else if (textVal == 'nPr')
                    displayValue += 'permutations(';
                else if (textVal == 'nCr')
                    displayValue += 'combinations(';
                else if (textVal == '|x|')
                    displayValue += 'abs(';
                else if (textVal == 'trans')
                    displayValue += 'transpose(';
                else {
                    displayValue += textVal;
                    if ($(this).hasClass('paren'))
                        displayValue += '(';
                }
                $('#input').val(displayValue);
                $('#result').val(resultValue);
                afterEXE = false;
            }
            if (!$(this).hasClass('folder'))
                $('.hideBtn').hide();
            e.preventDefault()
        })
    })

    $('#calculator').click(function (e) {
        if (!$(e.target).hasClass('key'))
            $('.hideBtn').hide();
    })

    $('#question').click(function(e){
        if(flag == 0){
            $('#calculator').hide();
            $('#help').show();
            flag = 1;
        }
        else{
            $('#calculator').show();
            $('#help').hide();
            flag = 0;
        }
        
        $('#graph_area').hide();
        $('#graph').text('graph');
        $('#graph').css('padding-left','5px');
        $('#graph').css('padding-right','5px');
    })
    
    $('#graph').click(function(e){
        if($(this).text() == 'graph'){
            $('#calculator').hide();
            $('#graph_area').show();
            $(this).text('back');
            $(this).css('padding-left','10px');
            $(this).css('padding-right','8px');
            
            $('#plot').empty();
            draw();
        }
        else{
            $('#calculator').show();
            $('#graph_area').hide();
            $(this).text('graph');
            $(this).css('padding-left','5px');
            $(this).css('padding-right','5px');
        }
        
        $('#help').hide();
        flag = 0;
    })

    var manager = [0,0,0,0,0,0];
    $('.help_btn').click(function(){
        $('.hidebtn').hide();
        var text_name = $(this).text();
        if(text_name == 'calculator'){
            if(manager[0] == 0){
                $('#calc_help').show();
                manager[0] = 1;
            }
            else{
                $('#calc_help').hide();
                manager[0] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 0) continue;
                manager[i] = 0;
            }
        }
        else if(text_name == 'graph'){
            if(manager[1] == 0){
                $('#graph_help').show();
                manager[1] = 1;
            }
            else{
                $('#graph_help').hide();
                manager[1] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 1) continue;
                manager[i] = 0;
            }
        }
        else if(text_name == 'folder'){
            if(manager[2] == 0){
                $('#folder_help').show();
                manager[2] = 1;
            }
            else{
                $('#folder_help').hide();
                manager[2] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 2) continue;
                manager[i] = 0;
            }
        }
        else if(text_name == 'undo/redo'){
            if(manager[3] == 0){
                $('#undo_help').show();
                manager[3] = 1;
            }
            else{
                $('#undo_help').hide();
                manager[3] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 3) continue;
                manager[i] = 0;
            }
        }
        else if(text_name == 'copy/paste'){
            if(manager[4] == 0){
                $('#copy_help').show();
                manager[4] = 1;
            }
            else{
                $('#copy_help').hide();
                manager[4] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 4) continue;
                manager[i] = 0;
            }
        }
        else if(text_name == 'shift/alpha'){
            if(manager[5] == 0){
                $('#shift_help').show();
                manager[5] = 1;
            }
            else{
                $('#shift_help').hide();
                manager[5] = 0;
            }
            for(var i = 0; i < 6; i++){
                if(i == 5) continue;
                manager[i] = 0;
            }
        }
    })

    $('#input').click(function(){
        is_input = 0;
    })
    $('#result').click(function(){
        is_input = 1;
    })
    $('#draw').click(function(){
        $('#plot').empty();
        $('#domain').show();
        draw();
    })

    $('.func_key').each(function(index, key){
        $(this).click(function (){
            if($(this).hasClass('func_key_available')){
                if($(this).hasClass('func_key_clicked'))
                    $(this).removeClass('func_key_clicked');
                else 
                    $(this).addClass('func_key_clicked');
            }

            var elements = document.getElementsByClassName('func_key');
            $('#func_list').val("");
            for(var i = 0; i < 12; i++){
                var element = elements.item(i);
                if($(element).hasClass('func_key_clicked')){
                    var func_name = $(element).text() + "(x)";
                    if(func_name in dict){
                        var Text =  $('#func_list').val() + func_name + "=" + dict[func_name] + "\n";
                        $('#func_list').val(Text);
                    }
                }
            }
        })
    })
    
    function draw(){
        try{
            var min = $('#min').val();
            var max = $('#max').val();
            var xValues = math.range(min, max, 0.1).toArray();
            var data = [];
            var layout = {
                width: 398.5, height: 535
            };

            var elements = document.getElementsByClassName('func_key');
            for(var i = 0; i < 12; i++){
                var element = elements.item(i);
                if($(element).hasClass('func_key_clicked')){
                    var func_name = $(element).text() + "(x)";
                    if(func_name in dict){
                        var expr = math.compile(dict[func_name]);
                        var yValues = xValues.map(function(x){ return expr.eval({x: x}); });

                        var trace = {
                            x: xValues,
                            y: yValues,
                            mode: 'lines',
                            name: func_name,
                            type: 'scatter',
                            line: {width: 1}
                        };
                        
                        data.push(trace);
                    }
                }
            }
            Plotly.newPlot('plot', data, layout);
        }
        catch(err){
            console.error(err);
            alert(err);
            $('#domain').hide();
        }
    }

    function ShiftON() {
        $('#1').text('!');
        $('#2').text('<');
        $('#3').text('>');
        $('#4').text('e'); $('#4').addClass('symbol-key');
        $('#5').text('pi'); $('#5').addClass('symbol-key');
        $('#5').removeClass('paren normal');
        $('#6').text('i');
    }

    function ShiftOff() {
        $('#1').text('^');
        $('#2').text('◀◀');
        $('#3').text('▶▶');
        $('#4').text(';'); $('#4').removeClass('symbol-key');
        $('#5').text('sqrt'); $('#5').removeClass('symbol-key');
        $('#5').addClass('paren normal');
        $('#6').text('x');
    }

    function AlphaON() {
        $('#1').text('exp'); $('#1').addClass('normal paren');
        $('#2').text('log'); $('#2').addClass('normal paren');
        $('#3').text('ceil'); $('#3').addClass('normal paren');
        $('#4').text('|x|'); $('#4').addClass('normal');
        $('#5').text('round');
        $('#6').text('floor'); $('#6').removeClass('symbol-key');
        $('#6').addClass('normal paren');
    }

    function AlphaOff() {
        $('#1').text('^'); $('#1').removeClass('normal paren');
        $('#2').text('◀◀'); $('#2').removeClass('normal paren');
        $('#3').text('▶▶'); $('#3').removeClass('normal paren');
        $('#4').text(';'); $('#4').removeClass('normal');
        $('#5').text('sqrt');
        $('#6').text('i'); $('#6').addClass('symbol-key');
        $('#6').removeClass('normal paren');
    }
})