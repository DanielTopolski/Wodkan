$(window).ready(
	function()
	{        
		$('#submitBtn0').click(function()
			{
				alert("CLIK");
				var title = $('.mod_title0').val();
				$('#sel_modal_title').html(title);
				$('#body_sel_page_id').html('');
				$('#get_dat_st').css({ display: "block" });
				var mod_link = $('.mod_link0').val();
				alert("MOD_LINK: "+mod_link);
				$.get(mod_link, function(data, status){
//					alert("Data: " + data + "\nStatus: " + status);
					$("#get_dat_st").css({ display: "none" });
					$('#body_sel_page_id').html(data);

				});
			}
		);
		$('#submitBtn1').click(function()
			{
//				alert("CLIK");
				var title = $('.mod_title1').val();
				$('#sel_modal_title').html(title);
				$('#body_sel_page_id').html('');
				$('#get_dat_st').css({ display: "block" });
				var link = $('.mod_link1').val();
				$.get(link, function(data, status){
//					alert("Data: " + data + "\nStatus: " + status);
					$("#get_dat_st").css({ display: "none" });
					$('#body_sel_page_id').html(data);
				});
			}
		);
		$('#submitBtn2').click(function()
			{
//				alert("CLIK");
				var title = $('.mod_title2').val();
				$('#sel_modal_title').html(title);
				$('#body_sel_page_id').html('');
				$('#get_dat_st').css({ display: "block" });
				var link = $('.mod_link2').val();
				$.get(link, function(data, status){
//					alert("Data: " + data + "\nStatus: " + status);
					$("#get_dat_st").css({ display: "none" });
					$('#body_sel_page_id').html(data);
				});
			}
		);
		$('#submitBtn3').click(function()
			{
//				alert("CLIK");
				var title = $('.mod_title3').val();
				$('#sel_modal_title').html(title);
				$('#body_sel_page_id').html('');
				$('#get_dat_st').css({ display: "block" });
				var link = $('.mod_link3').val();
				$.get(link, function(data, status){
//					alert("Data: " + data + "\nStatus: " + status);
					$("#get_dat_st").css({ display: "none" });
					$('#body_sel_page_id').html(data);
				});
			}
		);
		$('#nav_odcz').click(function()
			{
				alert("CLIK");
				var title = "Odczyty";
//				$('#sel_modal_title').html(title);
//				$('#body_sel_page_id').html('');
				$('#get_dat_st').css({ display: "block" });
				var mod_link = 'inc_ebok_page_click.php';
				alert("MOD_LINK: "+mod_link);
				var epage = 'odcz';
				$.post(mod_link, 
				   {
						page: epage
				   },
					function(data, status){
					alert("Data: " + data + "\nStatus: " + status);
					$("#get_dat_st").css({ display: "none" });
					$('#ebok_page_cont').html(data);
					return false;
				});
			}
		);
	}
);
