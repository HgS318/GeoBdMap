	$(function() {
		// Accordion
			$("#accordion").accordion( {
				autoHeight: false,
				collapsible: true,
				active:false,
				header :"h3"
			});
			$("#resultsat").accordion( {
				autoHeight: false,
				header :"h4"
			});
			$("#hierTree").treeview();
			$("#semanticTree").treeview();
		});