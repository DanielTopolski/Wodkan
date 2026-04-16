function check_tel_cud()
{
	var phn = document.getElementById("e_telefon").value;
	if(phn.length == 0)
	{
		document.getElementById('get_dat_st').style.display = 'block';
		return true;
	}
	else
	{
		if(!check_phone_cud(phn, 9, 15))
		{
			err=1;
			return false;
		}
		else
		{
			document.getElementById('get_dat_st').style.display = 'block';
			return true;
		}
	}

}
	function MyMsgCud(st)
	{
		document.getElementById("err_message").innerHTML = st;
		document.getElementById('err_com').style.display = 'block';
		return false;
	}
	function isInt(value) 
	{
	  return !isNaN(value) &&
			 parseInt(Number(value)) == value &&
			 !isNaN(parseInt(value, 10));
	}
	function check_phone_cud(tel, size, max)
	{		
//		alert(tel);
		if(!isInt(tel)) 
		{
			MyMsgCud("Pole Telefon kontaktowy' /Zakres: 100000000-999999999999999/");
			return false;
		}
		else
		{
			if (tel.length < size || tel.length > max) 
			{
				MyMsgCud("Pole Telefon kontaktowy' /Zakres: 100000000-999999999999999/");
				return false;
			}
			else
			{
				return true;
			}
		}
	}
