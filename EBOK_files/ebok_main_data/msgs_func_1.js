function show_att_adm(e,id,z,idu)
{
	wn_ref=window.open("ebok_awa_get_attach.php?idp="+id+"&ext="+e+"&zw="+z+"&idu="+idu, "Pomoc", "location='_blank', modal=yes, alwaysRaised=yes, left=250, top=10, width=800, height=550, scrollbars=yes");
	wn_ref.focus();
	return(false);
}

function show_att(e,id,z,idu)
{
	wn_ref=window.open("inc_ebok_get_attach.php?idp="+id+"&ext="+e+"&zw="+z+"&idu="+idu, "Pomoc", "location='_blank', modal=yes, alwaysRaised=yes, left=250, top=10, width=800, height=550, scrollbars=yes");
	wn_ref.focus();
	return(false);
}

function hide_msgbox()
{
	document.getElementById('msgbox').style.display = 'none'; 
	return false;
}

function hide_subjects_menu()
{
	document.getElementById('subjects_menu').style.display = 'none'; 
	document.getElementById('panel_menu_top').style.display = 'none';
	document.getElementById('panel_menu_top').style.display = 'none';
	document.getElementById('msgbox').style.display = 'none';
	return false;
}

function show_msgbox()
{
	document.getElementById('subjects_menu').style.display = 'none'; 
	document.getElementById('panel_menu_top').style.display = 'none';
	document.getElementById('msgbox').style.display = 'block'; 
	document.getElementById('panel_menu_top').style.display = 'none';
	document.getElementById('header_info').innerHTML = "Komunikaty: wybrany wpis";
	return false;
}

function myFunction(a, b, c1, c2, c3) 
{
  var t = "dt"+a;
  var d = "dat"+a+b;
  var te = document.getElementById(t).innerHTML;
  document.getElementById("msghead1_label").innerHTML = te;
  document.getElementById("msghead2_label").innerHTML = document.getElementById(d).innerHTML;
  var idt = "txt"+a+b;
  document.getElementById("Memo2").innerHTML = "</br>"+document.getElementById(idt).innerHTML+"</br></br>";
  if(b != 0)
  {
	var st_txt = document.getElementById("dd"+a+b).style.fontWeight;
	var s_dt =  document.getElementById("nread_idx"+a).innerHTML;
	if(st_txt == 'bold')
	{
		var cn = document.getElementById("cnt_r");
		if(cn.value > 0)
		{
			cn.value--;
		}
		s_dt--;
		if(s_dt == 0)
		{
			document.getElementById("nread_idx"+a).innerHTML = '';
			document.getElementById("dt"+a).style.fontWeight = 'normal';
		}
		else
		{
			document.getElementById("nread_idx"+a).innerHTML = s_dt;
		}
	}
	var s = document.getElementById("dd"+a+b).innerHTML;
	document.getElementById("stay_nread").onclick = function() {f_stay_nread(a, b); return false;};
	document.getElementById("dd"+a+b).style.fontWeight = 'normal';
	document.getElementById('idk').value = a;
	document.getElementById('idw').value = b;
	document.getElementById('read_idkw').value = 1;
	if(c1 != 0)
	{
		document.getElementById("att_header").style.display = 'block';
		document.getElementById("att_body").style.display = 'block';
		var cname = document.getElementById("attn"+a+b+c1).innerHTML;
		var e = check_extm(cname);
		var ico1 = check_icon(e);
		document.getElementById("img_att1").src = "images/"+ico1;
		document.getElementById("att_idp1").innerHTML = c1;
		document.getElementById("fname1").innerHTML = cname;
		document.getElementById("attach1").style.display = 'block';
	}
	if(c2 != 0)
	{
		var dname = document.getElementById("attn"+a+b+c2).innerHTML;
		var ico2 = check_icon(check_extm(dname));
		document.getElementById("img_att2").src = "images/"+ico2;
		document.getElementById("att_idp2").innerHTML = c2;
		document.getElementById("fname2").innerHTML = dname;
		document.getElementById("attach2").style.display = 'block';
	}
	if(c3 != 0)
	{
		var ename = document.getElementById("attn"+a+b+c3).innerHTML;
		var ico3 = check_icon(check_extm(ename));
		document.getElementById("img_att3").src = "images/"+ico3;
		document.getElementById("att_idp3").innerHTML = c3;
		document.getElementById("fname3").innerHTML = ename;
		document.getElementById("attach3").style.display = 'block';
	}
	return false;
  }
}

function ret_sub_list()
{
	var at = document.getElementById("get_att");
	at.value = 0;
	var idp = document.getElementById("idp");
	idp.value = '';
	var ex = document.getElementById("ext");
	ex.value = '';
}

function show_attachment(atnr)
{
	var cn = document.getElementById("fname"+atnr).innerHTML;
	var ex = cn.split('.');
	var e1 = ex[1];	
	var at = document.getElementById("get_att");
	at.value = 1;
	var kwp = document.getElementById("att_idp"+atnr).innerHTML;
	var idp = document.getElementById("idp");
	idp.value = kwp;
	var ex = document.getElementById("ext");
	ex.value = e1;
	var zw=document.getElementById("zw");
	z=zw.value;
	var idu=document.getElementById("idu").value;
	show_att(e1,kwp,z,idu);
	return(false);
}

function f_stay_nread(a1, b1)
{
	if(document.getElementById("orig"+a1+b1).innerHTML == 'administrator:')
	{
		document.getElementById("dd"+a1+b1).style.fontWeight = 'bold';
		var s_dt =  document.getElementById("nread_idx"+a1).innerHTML;
		if(s_dt == '')
		{
			document.getElementById("nread_idx"+a1).innerHTML = 1;
		}
		else
		{
			s_dt++;
			document.getElementById("nread_idx"+a1).innerHTML = s_dt;
		}
		var cn = document.getElementById("cnt_r");
		cn.value++;
		document.getElementById("dt"+a1).style.fontWeight = 'bold';
		document.getElementById('read_idkw').value = 0;
	}
	return false;
}

function check_extm(fn)
{
	var ta = fn.split(".");
	var c = ta.length;
	var ext = ta[c-1];
	return ext;
}

function check_icon(ext)
{
	var imga;
	switch(ext)
	{
		case 'DOCX':
		case 'DOC':
		case 'docx':
		case 'doc':
			imga = "image0021.png";
			break;
		case 'PDF':
		case 'pdf':
			imga = "pdf_icon1.png";
			break;
		case 'JPG':
		case 'PNG':
		case 'jpg':
		case 'png':
			imga = "picture_icon4.png";
			break;
		case 'ODT':
		case 'odt':
			imga = "otdicon.png";
				break;
		case 'CSV':
		case 'csv':
		case 'XLS':
		case 'XLSX':
		case 'xls':
		case 'xlsx':
			imga = "excel2.png";
				break;
		default:
			imga = '';
	}
	return imga;
}

function show_subjects_menu(str_head)
{
	var cn = document.getElementById("cnt_nread").innerHTML;
	document.getElementById("nr_dmsg").innerHTML = cn;
	document.getElementById('subjects_menu').style.display = 'block'; 
	document.getElementById('panel_menu_top').style.display = 'block';
	document.getElementById('header_info').innerHTML = str_head;
	document.getElementById("Upload_new_issue_msg1").value = '';
	document.getElementById("Upload_new_issue_msg2").value = '';
	document.getElementById("Upload_new_issue_msg3").value = '';
	MsgAttachments = []; 
	return false;
}

function set_sub_page(k)
{
	document.getElementById('sp').value = k;
	var a=document.getElementById('sp').value;
	return true;
}

function show_menu_help()
{
	document.getElementById('menu_help').style.display = 'block';
	return false;
}

function show_msgbox_help()
{
	document.getElementById('msgbox_help').style.display = 'block';
	return false;
}

/* ------------------------------------------------ issues ---------------------------------------- 
 *
 */
	MsgAttachments = []; 
	MsgSelectorFree = [1,2,3];

function show_new_issue_msgbox_help()
{
	document.getElementById('new_issue_msgbox_help').style.display = 'block';
	return false;
}

function hide_new_issue_msgbox()
{
	document.getElementById('new_issue_msgbox').style.display = 'none'; 
	return false;
}

function set_active_sel(s)
{
	document.getElementById('up_nei_'+s).style.display = 'block';
}

function set_deactive_sel(s)
{
	document.getElementById('up_nei_'+s).style.display = 'none';
}

function AddAttachment(s)
{
	var an = document.getElementById("Upload_new_issue_msg"+s).files[0].name;
	MsgAttachments.push(
	{ataname: an,
		atalink: set_link(s),
		ataicon: check_icon(check_ext(s)),
		ataselnr: s}
	);
	set_deactive_sel(s)
	MsgSelectorFree.shift();
	if(MsgSelectorFree.length != 0)
	{
		set_active_sel(MsgSelectorFree[0]);
	}
	else
	{
		document.getElementById("Select_attachment").style.display = 'none';
	}
}

function show_all_attach()
{
	clear_all_attach();
	if(MsgAttachments.length != 0)
	{
		i_abox = 1;
		MsgAttachments.forEach(show_attach_rec);
	}
}

function show_attach_rec(value)
{
	document.getElementById('Label2_outer'+i_abox).style.display = 'block';
	var i = document.getElementById("ico"+i_abox);
    i.innerHTML = '<DIV title="Sprawdź załącznik" id="Label1" style="font-family: Verdana; font-size: 1.0vw;" onmouseover="return Label1JSMouseOver(event)"><a align="center" id="test'+i_abox+'" name="test'+i_abox+'" href='+value.atalink+' target="NEW"><img id="ico_br" width="50px" align="center" height="60px" src="images/'+value.ataicon+'"/></a></DIV>';
	document.getElementById("fnamei"+i_abox).innerHTML = value.ataname;
	document.getElementById('ico'+i_abox).style.display = 'block';	
	i_abox++;
}

function clear_all_attach()
{
	document.getElementById("fnamei1").innerHTML = '';
	document.getElementById("fnamei2").innerHTML = '';
	document.getElementById("fnamei3").innerHTML = '';
	document.getElementById("ico1").innerHTML = '';
	document.getElementById("ico2").innerHTML = '';
	document.getElementById("ico3").innerHTML = '';
	document.getElementById('Label2_outer1').style.display = 'none';
	document.getElementById('Label2_outer2').style.display = 'none';
	document.getElementById('Label2_outer3').style.display = 'none';
	return false;
}

function show_new_issue_msgbox()
{
//	MsgAttachments = []; 
//	MsgSelectorFree = [1,2,3];
	set_active_sel(MsgSelectorFree[0]);
	var h = document.getElementById("msghead1_label").innerHTML;
//	alert("H: "+h);
	var i2 = h.indexOf(':');
	i2++;
	var s2 = h.substring(i2);
//	alert("S2: "+s2);
	document.getElementById('Subject_new_issue').value = s2;
	document.getElementById('repl_label').innerHTML = h;
	h1 = document.getElementById("msghead2_label").innerHTML;
	document.getElementById('repl1_label').innerHTML = h1;
	var tar_1 = document.getElementById('Mem_k1');
	var init_templ = "Dzień dobry, \r\n\r\n\r\n\Pozdrawiam,"+"\r\n"+document.getElementById("cur_uname").innerHTML;
	var tar_1 = document.getElementById('Mem_k1');
	tar_1.value = init_templ;
	document.getElementById('header_info').innerHTML = "Dodanie nowego komentarza do wybranego tematu"
	document.getElementById('new_issue_msgbox').style.display = 'block'; 
	document.getElementById("new_issue_msgbox").style.display = 'block';
	selectTextareaLine(tar_1,3);
	return false;
}

function set_link(s)
{
	var upl = document.getElementById("Upload_new_issue_msg"+s);
	var url = URL.createObjectURL(upl.files[0]);
	return url;
}

function check_ext(s)
{
	var upl = document.getElementById("Upload_new_issue_msg"+s);
	var fname =  upl.files[0].name;
	var ta = fname.split(".");
	var c = ta.length;
	var ext = ta[c-1];
	return ext;
}

function set_sub_page(k)
{
	document.getElementById('sp').value = k;
	var a=document.getElementById('sp').value;
	return true;
}

function get_at_sel(rec)
{
	var s = MsgAttachments[rec]["ataselnr"];
	return s;
}

function delete_ent_i(s)
{	
	var id = s;
	id--;
	var a_s = get_at_sel(id);
	MsgSelectorFree.push(a_s);
	switch(s)
	{
		case 1: MsgAttachments.shift();
				break;
		case 2: if(MsgAttachments.length == 3)
				{
					MsgAttachments[1] = MsgAttachments[2];
				}
				MsgAttachments.pop();
				break;
		case 3: MsgAttachments.pop();
				break;
	}
	if(MsgSelectorFree.length == 1)
	{
		document.getElementById("Select_attachment").style.display = 'block';
	}
	document.getElementById('Upload_new_issue_msg'+a_s).value = '';
	set_active_sel(MsgSelectorFree[0]);
	show_all_attach();
	return false;
}

function selectTextareaLine(tarea,lineNum) 
{
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) 
	{
        if(x == lineNum) 
		{
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") 
	{
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) 
	{
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function set_active_seln(s)
{
	document.getElementById('up_nen_'+s).style.display = 'block';
}

function set_deactive_seln(s)
{
	document.getElementById('up_nen_'+s).style.display = 'none';
}

function AddAttachmentn(s)
{
	var an = document.getElementById("Upload_new_msg"+s).files[0].name;
	MsgAttachments.push(
	{ataname: an,
		atalink: set_linkn(s),
		ataicon: check_icon(check_extn(s)),
		ataselnr: s}
	);
	set_deactive_seln(s)
	MsgSelectorFree.shift();
	if(MsgSelectorFree.length != 0)
	{
		set_active_seln(MsgSelectorFree[0]);
	}
	else
	{
		document.getElementById("Select_attachmentn").style.display = 'none';
	}
}

function show_all_attachn()
{
	clear_all_attachn();
	if(MsgAttachments.length != 0)
	{
		i_abox = 1;
		MsgAttachments.forEach(show_attach_recn);
	}
}

function show_attach_recn(value)
{
	document.getElementById('Label2_outern'+i_abox).style.display = 'block';
	var i = document.getElementById("icon"+i_abox);
    i.innerHTML = '<DIV title="Sprawdź załącznik" id="Label1" style="font-family: Verdana; font-size: 1.0vw;" onmouseover="return Label1JSMouseOver(event)"><a align="center" id="testn'+i_abox+'" name="testn'+i_abox+'" href='+value.atalink+' target="NEW"><img id="ico_br" width="50px" align="center" height="60px" src="images/'+value.ataicon+'"/></a></DIV>';
	document.getElementById("fnamen"+i_abox).innerHTML = value.ataname;
	document.getElementById('icon'+i_abox).style.display = 'block';	
	i_abox++;
}

function clear_all_attachn()
{
	document.getElementById("fnamen1").innerHTML = '';
	document.getElementById("fnamen2").innerHTML = '';
	document.getElementById("fnamen3").innerHTML = '';
	document.getElementById("icon1").innerHTML = '';
	document.getElementById("icon2").innerHTML = '';
	document.getElementById("icon3").innerHTML = '';
	document.getElementById('Label2_outern1').style.display = 'none';
	document.getElementById('Label2_outern2').style.display = 'none';
	document.getElementById('Label2_outern3').style.display = 'none';
	return false;
}

function click_header()
{
	var viz = document.getElementById('new_msgbox').style.display;
	if(viz == 'block')
	{
		document.getElementById('new_msgbox').style.display = 'none';
		document.getElementById('header_info').innerHTML = 'Uzupełnij szczegóły alwarii';
	}
	else
	{
		document.getElementById('new_msgbox').style.display = 'block';
		document.getElementById('header_info').innerHTML = 'Ukryj szczegóły awarii';
	}
}
function click_header_serv()
{
	var viz = document.getElementById('awa_detail').style.display;
	if(viz == 'block')
	{
		document.getElementById('label_btn').innerHTML = 'Pokaż szczegóły awarii';
		document.getElementById('awa_detail').style.display = 'none';
		var v = document.getElementById('label_btn').innerHTML;
	}
	else
	{
		document.getElementById('label_btn').innerHTML = 'Ukryj szczegóły awarii';
		document.getElementById('awa_detail').style.display = 'block';
		var v = document.getElementById('label_btn').innerHTML;
	}
}
function click_header_notw()
{
	var viz = document.getElementById('awa_notw_detail').style.display;
	if(viz == 'block')
	{
		document.getElementById('label_notw_btn').innerHTML = 'Pokaż notatki wewnętrzne';
		document.getElementById('awa_notw_detail').style.display = 'none';
		var v = document.getElementById('label_notw_btn').innerHTML;
	}
	else
	{
		document.getElementById('label_notw_btn').innerHTML = 'Ukryj notatki wewnętrzne';
		document.getElementById('awa_notw_detail').style.display = 'block';
		var v = document.getElementById('awa_notw_detail').innerHTML;
	}
}
function show_new_msgbox(str_head)
{
	MsgAttachments = []; 
	MsgSelectorFree = [1,2,3];
	document.getElementById('header_info').innerHTML = str_head;
	document.getElementById("repl_label_outern").style.display = 'none'; 
	set_active_seln(MsgSelectorFree[0]);
	var init_templ = "Dzień dobry, \r\n\r\n\r\n\r\nPozdrawiam,"+"\r\n"+document.getElementById("cur_uname").innerHTML;
	var tar_1 = document.getElementById('Memo1');
	tar_1.value = init_templ;
	document.getElementById('new_msgbox').style.display = 'block'
	selectTextareaLine(tar_1,4);
	return false;
}

function hide_new_msgbox()
{
	document.getElementById('new_msgbox').style.display = 'none';
	return false;
}

function set_linkn(s)
{
	var upl = document.getElementById("Upload_new_msg"+s);
	var url = URL.createObjectURL(upl.files[0]);
	return url;
}

function check_extn(s)
{
	var upl = document.getElementById("Upload_new_msg"+s);
	var fname =  upl.files[0].name;
	var ta = fname.split(".");
	var c = ta.length;
	var ext = ta[c-1];
	return ext;
}

function get_at_seln(rec)
{
	var s = MsgAttachments[rec]["ataselnr"];
	return s;
}

function delete_ent_n(s)
{	
	var id = s;
	id--;
	var a_s = get_at_seln(id);
	MsgSelectorFree.push(a_s);
	switch(s)
	{
		case 1: MsgAttachments.shift();
				break;
		case 2: if(MsgAttachments.length == 3)
				{
					MsgAttachments[1] = MsgAttachments[2];
				}
				MsgAttachments.pop();
				break;
		case 3: MsgAttachments.pop();
				break;
	}
	if(MsgSelectorFree.length == 1)
	{
		document.getElementById("Select_attachmentn").style.display = 'block';
	}
	document.getElementById('Upload_new_msg'+a_s).value = '';
	set_active_seln(MsgSelectorFree[0]);
	show_all_attachn();

	return false;
}

function valid_extn(s)
{
	var fn = document.getElementById("Upload_new_msg"+s).files[0];
	var an = fn.name;
	var siz = fn.size;
	var ext = check_extm(an);
	if(ext == "JPEG" || ext == "jpeg" || ext == "jpg" || ext == "JPG" || ext == "doc" || ext == "DOC" || ext == "docx" || ext == "DOCX" || ext == "pdf" || ext == "PDF" || ext == "xls" || ext == "xlsx" || ext == "XLS" || ext == "XLSX" || ext == "PNG" || ext == "png" || ext == "odt" || ext == "ODT")
	{
		if(siz > 3000000)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

function valid_ext(s)
{
	var fn = document.getElementById("Upload_new_issue_msg"+s).files[0];
	var an = fn.name;
	var siz = fn.size;
	var ext = check_extm(an);
	if(ext == "JPEG" || ext == "jpeg" || ext == "jpg" || ext == "JPG" || ext == "doc" || ext == "DOC" || ext == "docx" || ext == "DOCX" || ext == "pdf" || ext == "PDF" || ext == "xls" || ext == "xlsx" || ext == "XLS" || ext == "XLSX" || ext == "PNG" || ext == "png" || ext == "odt" || ext == "ODT")
	{
		if(siz > 3000000)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

function check_up_new_issue_msg(sel)
{
	if(valid_ext(sel))
	{
		AddAttachment(sel);
		show_all_attach();
	}
	else
	{
		document.getElementById("Upload_new_issue_msg"+sel).value = '';
		var str_en = "Niedopuszczalny typ pliku lub przekroczony max rozmiar pliku (3MB).</br>Dopuszczalne są tylko typy: jpg, png, doc, docx, pdf, xls, xlsx"; 
		show_error_msg(str_en);
	}
	return false;
}

function check_up_new_msg(sel)
{
	if(valid_extn(sel))
	{
		AddAttachmentn(sel);
		show_all_attachn();
	}
	else
	{
		document.getElementById("Upload_new_msg"+sel).value = '';
		var str_en = "Niedopuszczalny typ pliku lub przekroczony max rozmiar pliku (3MB).</br>Dopuszczalne są tylko typy: jpg, png, doc, docx, pdf, xls, xlsx"; 
		show_error_msg(str_en);
	}
	return false;
}

function show_new_msgbox_help()
{
	document.getElementById('new_msgbox_help').style.display = 'block';
	return false;
}

function set_sub_page(k)
{
	document.getElementById('sp').value = k;
	var a=document.getElementById('sp').value;
	return true;
}

function clean_sel_filesn()
{
	var cl1 = document.getElementById('Upload_new_msg1');
	cl1.value = '';
	var cl2 = document.getElementById('Upload_new_msg2');
	cl2.value = '';
	var cl3 = document.getElementById('Upload_new_msg3');
	cl3.value = '';
}

function Klick_send_new_issue_msgs()
{
	var s = document.getElementById('Subject_new_issue');
	if(s.value == '')
	{
		var er = "Temat komunikatu nie może być pusty";
		show_error_msg(er);
		return false;
	}
	else
	{
		var tr = document.getElementById('Mem_k1');
		if(tr.value == '')
		{
			var er = "Treść komunikatu nie może być pusta";
			show_error_msg(er);
			return false;
		}
		else
		{
			document.getElementById("get_dat_st").style.display = 'block';
			return true;
		}
	}
}

function show_error_msg(erstr)
{
	document.getElementById('err_detail').innerHTML = erstr;
	document.getElementById('err_msgs').style.display = 'block'; 
	return false;
}

function Klick_validate()
{
	if(document.getElementById('new_msgbox').style.display == 'block')
	{
		return Klick_send_new_msgs();
	}
	if(document.getElementById('new_issue_msgbox').style.display == 'block')
	{
		return Klick_send_new_issue_msgs();
	}

}

function Klick_send_new_msgs()
{
	document.getElementById('read_idkw').value = 3;
	var s = document.getElementById('Subject_new');
	var str = s.value;
	var stb = str.replace(/ /g, '');
	if((str.length == 0) || (stb.length == 0))
	{
		var er = "Temat komunikatu nie może być pusty.";
		show_error_msg(er);
		document.forms["EBOK_MSGS"].onsubmit="return false;";
		return false;
	}
	else
	{
		var tr = document.getElementById('Memo1');
		if(tr.value == '')
		{
			var er = "Treść komunikatu nie może być pusta";
			show_error_msg(er);
			document.forms["EBOK_MSGS"].onsubmit="return false;";
			return false;
		}
		else
		{
			document.forms["EBOK_MSGS"].onsubmit="return true;";
			document.getElementById("get_dat_st").style.display = 'block';
			return true;
		}
	}
}

function set_home()
{
	var nr = document.getElementById('read_idkw');
	nr.value = 3;
}

function set_all_read()
{
	var nr = document.getElementById('read_idkw');
	nr.value = 2;
	var cn = document.getElementById("cnt_r");
	cn.value = 0;
	document.getElementById("nr_dmsg").innerHTML = 0;
}

function set_read()
{
	var nr = document.getElementById('read_idkw');
	nr.value = 1;
	var nrd = document.getElementById("nrdmsg");
	nrd.value--;
	return true;
}

function set_not_read() 
{
	var nr = document.getElementById('read_idkw');
	nr.value = 0;
	var nrd = document.getElementById("nrdmsg");
	nrd.value++;
	return false;
}
