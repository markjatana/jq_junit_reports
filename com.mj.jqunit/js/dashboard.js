	// test case json state pass value
	var PASS_KEY = 'passed';
	
	// test case json state fail value
	var FAIL_KEY = 'failed';
	
	// style class for passed elements
	var PASS_CLASS = 'pass';
	
	// style class for fail elements
	var FAIL_CLASS = 'fail';

function generateMarkUp(run){
		generateRunContainers(run);
		generateSuites(run, run.id);
		for(var i = 0; i < run.testSuites.length; i++){
			generateCases(run.testSuites[i]);
		}
		addListeners(run);
		addPassFailIndicators(run);
		setFontSize();
		
		document.getElementById('suiteMargin_2').addEventListener("click", createHideListener(['caseException_21'], 'caseTwistie_21'), false);
	}
	
	function addPassFailIndicators(run){

		var progBar = document.getElementById('progressBar_'+run.id);
		$(progBar).width((run.completed/run.total)*100+'%');
		var color = 'red';
		if(run.failures == 0){
			color = 'green';
		}
		$(progBar).css('background', color);
		var runMargin = document.getElementById('runMargin_'+run.id);
		$(runMargin).css('border', 'solid 2px '+color);
		for(var i = 0; i < run.testSuites.length ; i++){
			var testSuite = run.testSuites[i];
			var suiteMarginElement = document.getElementById('suiteMargin_'+testSuite.id);
			var hasFail = false;
			for(var x = 0; x < testSuite.testCases.length ; x++){
				var testCase = testSuite.testCases[x];
				var caseMarginElement = document.getElementById('caseMargin_'+testCase.id);
				if(testCase.state == FAIL_KEY){
				  var hasFail = true;
			      $(caseMarginElement).addClass(FAIL_CLASS);	  
				}else if(testCase.state == PASS_KEY){
				  $(caseMarginElement).addClass(PASS_CLASS);
				}
			}
			if(hasFail){
			      $(suiteMarginElement).addClass(FAIL_CLASS);
			}else {
				  $(suiteMarginElement).addClass(PASS_CLASS);
			}
				
		}
	}
	
	
	function addListeners(run){
		for(var i = 0; i < run.testSuites.length; i++){
			
			var testSuite = run.testSuites[i];
			document.getElementById('runMargin_'+run.id).addEventListener("click", createHideListener(['suiteContainer_'+testSuite.id], 'runTwistie_'+run.id), false);
			
			var caseContainerIds = [];
			for(var x=0; x < testSuite.testCases.length; x++){
				var testCase = testSuite.testCases[x];
				var caseContainerId = "caseContainer_"+testCase.id;
				caseContainerIds.push(caseContainerId);
				var caseLogIds = [];
				if(testCase.exception){
					caseLogIds.push("caseException_"+testCase.id)
				}
				if(testCase.output){
					caseLogIds.push("caseOutput_"+testCase.id)
				}
				if(caseLogIds.length !=0) {
					var caseTwistieId = 'caseTwistie_'+testCase.id;
					console.log(caseLogIds);
					console.log(caseTwistieId);
					document.getElementById(caseContainerId).addEventListener("click", createHideListener(caseLogIds, caseTwistieId), false);
					//document.getElementById(caseContainerId).addEventListener("click", function(){alert("clicked ")}, false);
					
				}
			}
			document.getElementById('suiteMargin_'+testSuite.id).addEventListener("click", createHideListener(caseContainerIds, 'suiteTwistie_'+testSuite.id), false);
		}
		//add a resize listener to the run container
		window.addEventListener("resize", resizeThrottler, false);
	}
	
	/**
	 * Resizes the main test element size
	 */
	function setFontSize(){
		var testContainer = document.getElementById('testContainer');
		var size = $(testContainer).width();
		var fontSize = (size/1075)*100;
		$(testContainer).css('font-size',fontSize+'%');
		$(document.getElementById('size')).text('Size is '+size);
	}
	
	var resizeTimeout;
	  function resizeThrottler() {
	    // ignore resize events as long as an actualResizeHandler execution is in the queue
	    if ( !resizeTimeout ) {
	      resizeTimeout = setTimeout(function() {
	        resizeTimeout = null;
	        setFontSize();
	     
	       // The actualResizeHandler will execute at a rate of 15fps
	       }, 66);
	    }
	  }
	
	
	/**
	 * Add run containers
	 */
	function generateRunContainers(run){
		$(document.getElementById('testContainer')).prepend('<div id="run_'+ run.id +'" class="runContainer group">'
				+'<div class="runHeader group">'
					+'<div id="runMargin_'+ run.id +'" class="runMargin rounded margin group">'
						+'<div id="runTwistie_'+ run.id +'" class=" twistie runTwistie">-</div>'
					+'</div>'
					+'<div class="summary rounded">'
						+'<ol class="details group">'
						+ '<li>'+run.name+': '+run.completed+'/'+ run.total +'</li>'
						+ '<li>Errors: '+ run.errors +'</li>'
						+ '<li>Failures: '+ run.failures +'</li>'
						+'</ol>'
						+'<div id="progressBar_'+ run.id +'"class="progressBar"></div>'
					+'</div>'
				+'</div>'
			+'</div>');
		
	}
	
	/*
	 * Add suites
	 */
	function generateSuites(run, id){
			var runContainer = document.getElementById('run_'+id);
			for(var i = 0; i < run.testSuites.length; i++){
				var testSuite = run.testSuites[i];
				$(runContainer).append(
						'<div id="suiteContainer_'+ testSuite.id +'" class="suiteContainer group">'
						+	'<div class="suiteHeader group">'
						+		'<div id="suiteMargin_'+ testSuite.id +'" class="suiteMargin group rounded margin">'
						+			'<div id="suiteTwistie_'+ testSuite.id +'" class=" twistie">-</div>'
						+		'</div>'
						+		'<div class="suiteDetails rounded">'+ testSuite.name +'</div>'
						+	'</div>'		
					+	'</div>'		
			    );
				
			}
	}
	
	function generateCases(testSuite){
		var suiteContainerElement = document.getElementById('suiteContainer_'+testSuite.id);
		for(var i = 0; i < testSuite.testCases.length; i++){
			var testCase = testSuite.testCases[i];
			$(suiteContainerElement).append(
					'<div id="caseContainer_'+ testCase.id +'" class="caseContainer group">'
			
					+	'<div id="caseHeader" class="caseHeader group">'
					+		'<div id="caseMargin_'+ testCase.id +'" class="margin caseMargin rounded group odd">'	
					+			'<div id="caseTwistie_'+ testCase.id +'" class="twistie caseTwistie">-</div>'
					+		'</div>'
					+		'<div id="case_'+ testCase.id +'" class="caseDetails rounded group odd">' + testCase.name +'</div>'
						+'</div>'
					+'</div');
		}
		for(var i = 0; i < testSuite.testCases.length; i++){
			var testCase = testSuite.testCases[i];
			var testCaseContainerElement = document.getElementById('caseContainer_'+testCase.id);
			if(testCase.exception){
				$(testCaseContainerElement).append(
					'<div id="caseException_' +testCase.id + ' "class="caseOutput rounded group">'
						+  '<div class="caseOutputTitle">Exception:</div>'
						+  '<div class="caseOutputText">'+ testCase.exception + '</div>'
					+ '</div');
				
			}
			if(testCase.output){
				$(testCaseContainerElement).append(
					'<div id="caseOutput_' +testCase.id + ' "class="caseOutput rounded group">'
						+  '<div class="caseOutputTitle">Output:</div>'
						+  '<div class="caseOutputText">'+ testCase.output + '</div>'
					+ '</div');
			}
		}
	}
	
	

	function createHideListener(ids, twistieId){
		var hideElements = function(){
			for(var i=0;i < ids.length;i++){
				hide(ids[i]);
			}
			switchTwistie(twistieId);
		}
		return hideElements;
	}

	function hide(id){
		var result = $('#'+id).slideToggle('slow');
		console.log("Trying to toggle "+id);
	}
	
	function switchTwistie(id){
		var less = "-";
		var more = "+";
		var element = document.getElementById(id);
		if(element.innerHTML == less){
			element.innerHTML = more;
		}else{
			element.innerHTML = less;
		}
	}