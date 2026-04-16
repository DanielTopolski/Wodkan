	function trig_help()
	{
		var help = document.getElementById('new_msgbox_help');
		var viz = help.style.display;
//		alert("v="+viz);
		if(viz == 'block')
		{
			document.getElementById('new_msgbox_help').style.display = 'none';
		}
		else
		{
			document.getElementById('new_msgbox_help').style.display = 'block';
		}
	}
	function checkObj(code,range,name, size)
	{
		var inpObj = document.getElementById(code);
		inpObj.pattern = range;
		var str_c = inpObj.value;
//		alert("VAL="+str_c+",size="+str_c.length+", chk="+inpObj.checkValidity()+", siz="+size+", cd="+code+", rang="+range+", nam="+name);
		if (str_c.length < size || !inpObj.checkValidity()) 
		{
//			alert("NegChk"+", msg="+inpObj.validationMessage);
//			alert("Pole "+name+inpObj.validationMessage);
			MyMsg("Pole "+name+inpObj.validationMessage);
//			document.getElementById("Label_msg").innerHTML = "Pole "+name+inpObj.validationMessage;
//			document.getElementById('gconf_msg').style.display = 'block';
			err = 1;
			return false;
		}
		else
		{
			return true;
		}
	}
	function MyMsg(st)
	{
		document.getElementById("Label_msg").innerHTML = st;
		document.getElementById('gconf_msg').style.display = 'block';
		return false;
	}
	function check_date()
	{
//		alert("date");
		var t = new Date();
		var d = t.getDate();
		var m = t.getMonth();
		var y = t.getFullYear();
		var today = y+m+d;
		var e_dat = document.getElementById("f-calendar-field-1").value;
		var year=parseInt(e_dat.split("-")[0]);
		var month=parseInt(e_dat.split("-")[1]);
		var day=parseInt(e_dat.split("-")[2]);
        month -= 1;
		var sel = year+month+day;
//		alert("data="+sel+",t="+today);
		if(sel > today)
		{
			document.getElementById("f-calendar-field-1").value = y+"-"+(m+1)+"-"+d;
			return false;
		}
		else
		{
			return true;
		}
	}
	function check_form()
	{
//		alert("check_form");
		if(check_date())
		{
			var ta = document.getElementById("e_rodz_awa").selectedIndex;
			var tao = document.getElementById("e_rodz_awa").options;			
			var rmet = tao[ta].value;
//			alert("emet="+rmet);
//			alert("met_req="+met_req_tb[rmet]);
			if(met_req_tb[rmet] == 1)
			{
//				alert("Met_req");
				if(!checkObj("e_nr_licz","[a-zA-Z0-9-/.,]{5,25}","'Numer licznika' /Zakres: 5-25 cyfry,litery,'-','/','.',',':",5))
				{
					err=1;
					return false;
				}
			}
			if(!checkObj("e_name_odb","[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-. ]{5,50}","'Nazwisko i imię' /Zakres: 5-50 liter,'-','.',odstęp/:",5))
			{
				err=1;
				return false;
			}
			var phn = document.getElementById("e_telefon").value;
			if(!check_phone(phn, 9, 15))
			{
				err=1;
				return false;
			}
			if(!checkObj("e_miasto","[0-9a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-. ]{3,50}","'Miejscowość' /Zakres: 3-50 cyfr,liter,'-','.',odstęp/:",3))
			{
				err=1;
				return false;
			}			
			if(!checkObj("e_ulica","[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-./ ]{5,50}","'Ulica' /Zakres: 5-50 liter+'-'+'.'+odstęp/:",5))
			{
				err=1;
				return false;
			}			
			if(!checkObj("e_nr_dom","[0-9a-zA-Z/. ]{1,10}","'Numer domu' /Zakres: 1-10 cyfr, '/', '.', litery, odstęp/:",1))
			{
				err=1;
				return false;
			}
			if(document.getElementById("Memo1").value == '')
			{
				MyMsg("Pole 'Treść' nie może być puste");
				return false;
			}
		}
		else
		{
			MyMsg("Data awarii nie może być większa od daty bieżącej.");
			return false;
		}
		return true;
	}
   function e_nr_podJSChange(event)
   {
//		alert("POD_CH");
		var event = event || window.event;
		var params=null;
		var tv = document.getElementById("e_nr_pod").value;
		var ta = document.getElementById("e_rodz_awa").selectedIndex;
		var tao = document.getElementById("e_rodz_awa").options;
		var metv = document.getElementById("e_nr_licz").value;
		if(metv != '')
		{
			document.getElementById("Subject_new").value = tao[ta].text+' - Punkt '+tv+"/licznik "+metv;
		}
		else
	    {
			if(tv != '')
			{
				document.getElementById("Subject_new").value = tao[ta].text+' - Punkt '+tv;
			}
			else
			{
				document.getElementById("Subject_new").value = tao[ta].text;
			}
		}
		return false;			
   }
   function e_nr_liczJSChange(event)
   {
		var event = event || window.event;
		var params=null;
		return e_nr_podJSChange(event);
   }
   function Sel_pod_noJSChange(event)
   {
		var event = event || window.event;
		var params=null;
//		alert("pod_changed");
		var x = document.getElementById("Sel_pod_no").selectedIndex;
		var y = document.getElementById("Sel_pod_no").options;
		removeOptions(document.getElementById("Sel_meter_no"));
		if(y[x].text != 'Wybór punktu')
	   {
			document.getElementById("e_nr_pod").value = y[x].text;
			pod_adres[x].forEach(adr);
			if(pod_met_tb.length > 0)
		    {
				pod_met_tb[x].forEach(mfx);
		    }
			document.getElementById("Sel_meter_no").value = 0;
			document.getElementById("e_nr_licz").value = '';
			e_nr_podJSChange(event);
	   }
	   else
	   {
			document.getElementById("e_nr_pod").value = '';
			document.getElementById("Subject_new").value = '';
			document.getElementById("e_nr_licz").value = '';
			if(met_tb.length > 0)
		    {
				met_tb.forEach(mfx);
		    }
	   }
	   document.getElementById("sel_pod").style.display = 'none';
	   return e_nr_pod_updatehidden(event);
   }
	function removeOptions(selectbox)
	{
		var i;
		for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
		{
			selectbox.remove(i);
		}
	}
	function mfx(value)
	{
		var a = document.getElementById("Sel_meter_no");
		var option = document.createElement("option");
		option.text = value.name;
		if(value.val == 0)
		{
			option.value = value.val;
			option.selected="selected"; 
		}
		else
		{
			option.value = value.val;
		}
//		alert("opt_sel="+option.value+", "+option.selected);
		a.add(option); 
	}
   function e_nr_podJSupdate()
   {
		var p = document.getElementById("Sel_pod_no").selectedIndex;
		var po = document.getElementById("Sel_pod_no").options;
		document.getElementById("e_nr_pod").value = po[p].text;
   }
   function Sel_meter_noJSChange(event)
   {
		var event = event || window.event;
		var params=null;
//		alert("meter_changed");
		var x = document.getElementById("Sel_meter_no").selectedIndex;
		var y = document.getElementById("Sel_meter_no").options;
		if(y[x].text != 'Wybór licznika')
	    {
			document.getElementById("e_nr_licz").value = y[x].text;
			var val = y[x].value;
			m_idx = val;
			var pidx = met_pod_tb[val];
			document.getElementById("Sel_pod_no").value = pidx;
			var p = document.getElementById("Sel_pod_no").selectedIndex;
			var po = document.getElementById("Sel_pod_no").options;
			document.getElementById("e_nr_pod").value = po[p].text;
			removeOptions(document.getElementById("Sel_meter_no"));			
			if(pod_met_tb.length > 0)
		    {
				pod_met_tb[p].forEach(mfx);
		    }
			document.getElementById("Sel_meter_no").value = val;
		}
		else
	    {
			document.getElementById("e_nr_licz").value = '';
			m_idx = null;
			document.getElementById("Sel_meter_no").value = 0;
	    }
		document.getElementById("sel_meter").style.display = 'none';
		return e_nr_podJSChange(event);
   }
   function e_rodz_awaJSChange(event)
   {
		var event = event || window.event;
		var params=null;
//		Sel_pod_noJSChange(event);
		return e_rodz_awa_updatehidden(event);
//		return e_nr_podJSChange(event);
   }
	function adr(value)
	{
		document.getElementById("e_miasto").value = value.miasto;
		document.getElementById("e_ulica").value = value.ulica; 
		document.getElementById("e_nr_dom").value = value.nr; 
	}
	function isInt(value) 
	{
	  return !isNaN(value) &&
			 parseInt(Number(value)) == value &&
			 !isNaN(parseInt(value, 10));
	}
	function check_phone(tel, size, max)
	{		
//		alert(tel);
		if(!isInt(tel)) 
		{
			MyMsg("Pole Telefon kontaktowy' /Zakres: 100000000-999999999999999/");
			return false;
		}
		else
		{
			if (tel.length < size || tel.length > max) 
			{
				MyMsg("Pole Telefon kontaktowy' /Zakres: 100000000-999999999999999/");
				return false;
			}
			else
			{
				return true;
			}
		}
	}
	function check_form_logof()
	{
		var subj = document.getElementById("Subject_new").value;
		if(subj == '')
		{
			var e = document.getElementById("e_rodz_awa");
			var str = e.options[e.selectedIndex].text;
			document.getElementById("Subject_new").value = str;
		}
		if(!checkObj("e_code","[0-9]{8}","'Kod jednorazowy' /Zakres: 10000000-99999999/:",8))
		{
			err=1;
			return false;
		}
		if(check_date())
		{
			var ta = document.getElementById("e_rodz_awa").selectedIndex;
			var tao = document.getElementById("e_rodz_awa").options;			
			var rmet = tao[ta].value;
			if(met_req_tb[rmet] == 1)
			{
				if(!checkObj("e_nr_licz","[a-zA-Z0-9-/.,]{5,25}","'Numer licznika' /Zakres: 5-25 cyfry,litery,'-','/','.',',':",5))
				{
					err=1;
					return false;
				}
			}
			if(!checkObj("e_name_odb","[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-. ]{5,50}","'Nazwisko i imię' /Zakres: 5-50 liter,'-','.',odstęp/:",5))
			{
				err=1;
				return false;
			}
			var phn = document.getElementById("e_telefon").value;
			if(!check_phone(phn, 9, 15))
			{
				err=1;
				return false;
			}
			if(!checkObj("e_miasto","[0-9a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-. ]{3,50}","'Miejscowość' /Zakres: 3-50 cyfr,liter,'-','.',odstęp/:",3))
			{
				err=1;
				return false;
			}			
			if(!checkObj("e_ulica","[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż-./ ]{5,50}","'Ulica' /Zakres: 5-50 liter, '-', '.', '/', odstęp:",5))
			{
				err=1;
				return false;
			}			
			if(!checkObj("e_nr_dom","[0-9a-zA-Z/. ]{1,10}","'Numer domu' /Zakres: 1-10 cyfr, '/', '.', litery, odstęp/:",1))
			{
				err=1;
				return false;
			}
			if(document.getElementById("Memo1").value == '')
			{
				MyMsg("Pole 'Treść' nie może być puste");
				return false;
			}			
		}
		else
		{
			MyMsg("Data awarii nie może być większa od daty bieżącej.");
			return false;
		}
		return true;
	}
	function MyLoad()
	{
//		alert("MyL");
		var pod = document.getElementById("e_podmiot");
		var nip = document.getElementById("e_tax_id");
		var n = document.getElementById("e_name");
		var val = pod.value;
//		alert("val="+val);
		if(val == 0)
		{
			nip.disabled = true;
			n.disabled = false;
		}
		else
		{
			nip.disabled = false;
			n.disabled = true;
		}
		return false;
	}
