//Javascript function to load pagination controls
load = function(procedurecount) {
		window.tp = new Pagination('#tablePaging', {
		itemsCount: procedurecount,
		onPageSizeChange: function (ps) {
			console.log('changed to ' + ps);
		},
		onPageChange: function (paging) {
			//custom paging logic here
			console.log(paging);
			var start = paging.pageSize * (paging.currentPage - 1),
				end = start + paging.pageSize,
				$rows = $('.product').find('.row');

			$rows.hide();

			for (var i = start; i < end; i++) {
				$rows.eq(i).show();
			}
		}
	});
}
//Javascript function to enable or disable filter checkboxes in treatments offered
initfilter = function() {	
	$("input[type='checkbox']").on('change', function(){  
		var nameattr=$(this).attr('name')
		if(nameattr==='hospitalname'){
		   $("input[name='procedure']").removeAttr('checked'); 
			$("input[name='city']").removeAttr('checked');						
		}
		
		if(nameattr==='procedure'){
			$("input[name='hospitalname']").removeAttr('checked'); 
			$("input[name='city']").removeAttr('checked');				
		}
		
		if(nameattr==='city'){
			$("input[name='hospitalname']").removeAttr('checked'); 
			$("input[name='procedure']").removeAttr('checked'); 							
		}     
		$('#filterform').submit();
	   
	});						 
}	