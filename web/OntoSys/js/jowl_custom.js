	/** 
	 Modify this configuration object to fine-tune the visualisation of the jOWL browser.
	 */
	var configuration = {
		ontology :"data/ontology.owl", //the ontology to load
		owlClass :null, //The class to show when loading
		classOverview :true, //show or hide the class overview list.
		propertiesTab :true, //show or hide the properties panel
		individualsTab :true, //show or hide the individuals panel
		sparqldlTab :true
	//show or hide the sparq-dl panel
	}

	/** 
	 Do not Modify the code below unless you know what you are doing.
	 */
	$(document).ready( function() {
		if (!configuration.propertiesTab) {
			$('#propertyPanel').remove();
			$('#tab2').remove();
		}
		if (!configuration.individualsTab) {
			$('#thingwidget').appendTo("body").hide();
			$('#individualPanel').remove();
			$('#tab3').remove();
		}
		if (!configuration.sparqldlTab) {
			$('#sparqldlPanel').remove();
			$('#tab4').remove();
		}

		$("#tabs").tabs();

		jOWL.load(configuration.ontology, initjOWL, {
			reason :true,
			locale :'en'
		});
	});

	function initjOWL() {

		createOntologyWidget();
		var conceptWidget = createConceptWidget();

		if (configuration.classOverview) {
			jOWLBrowser.views.push( {
				query :"Class(?x)",
				element :$('#classlist'),
				widget :conceptWidget
			});
		}

		if (configuration.propertiesTab) {
			var propertyWidget = createPropertyWidget();
			jOWLBrowser.views.push( {
				query :"ObjectProperty(?x)",
				element :$('#OPlist'),
				widget :propertyWidget
			});
			jOWLBrowser.views.push( {
				query :"DatatypeProperty(?x)",
				element :$('#DPlist'),
				widget :propertyWidget
			});
		}

		if (configuration.individualsTab) {
			var thingWidget = createIndividualsWidget();

			setTimeout( function() {//show individuals asynchronously
						var arr = new jOWL.Ontology.Array();
						for (key in jOWL.index('Thing')) {
							arr.concat(jOWL.index('Thing')[key], true);
						}
						showOverviewResults(arr, $('#thinglist'), thingWidget);
					}, 200);

		}

		if (configuration.sparqldlTab) {
			createSparqlDLWidget();
		}

		createOverviewWidget();
	}