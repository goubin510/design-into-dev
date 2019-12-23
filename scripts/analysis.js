module.exports = {
  foo: function () {
    console.log("foo")
  },
  bar: function (e) {
    console.log("e", e)
  },
  basics: function (e) {
  	var res = {};
  	var temp = {};

//Previous
	var date = new Date();
	date.setDate(date.getDate() - 1)
	date.setHours(23,59,59);

  	for (var i = 0; i < e.length; i++) {
  		if(e[i].date < date) {
	  		if(temp[e[i].category])
	  			temp[e[i].category] += e[i].amount
	  		else temp[e[i].category] = e[i].amount
	  	}
  	}

  	res.previous = temp;
  	temp = {};

//Today
	date = new Date();
	date.setDate(date.getDate())
	date.setHours(0,0,0);

  	for (var i = 0; i < e.length; i++) {
  		if(e[i].date >= date) {
	  		if(temp[e[i].category])
	  			temp[e[i].category] += e[i].amount
	  		else temp[e[i].category] = e[i].amount
	  	}
  	}

  	res.today = temp;
  	temp = {};

//Ongoing
	temp.Loisirs = isValuable(res.previous.Loisirs) + isValuable(res.today.Loisirs)
	temp.Epargne = isValuable(res.previous.Epargne) + isValuable(res.today.Epargne)
	temp.Obligations = isValuable(res.previous.Obligations) + isValuable(res.today.Obligations)
	temp.Revenue = isValuable(res.previous.Revenue) + isValuable(res.today.Revenue)

  	res.ongoing = temp;
  	temp = {};

//Quotas
	date = new Date();
	var dayLeft = 32 - date.getDate()

	temp.Loisirs = [];
	temp.Loisirs.push((isValuable(res.previous.Revenue) * 0.3).toFixed(2))
	temp.Loisirs.push((isValuable(res.ongoing.Revenue) * 0.3).toFixed(2))
	temp.Loisirs.push(((temp.Loisirs[0] - isValuable(res.previous.Loisirs)) / dayLeft).toFixed(2))
	temp.Loisirs.push(((temp.Loisirs[1] - isValuable(res.ongoing.Loisirs)) / dayLeft).toFixed(2))

	temp.Epargne = [];
	temp.Epargne.push((isValuable(res.previous.Revenue) * 0.2).toFixed(2))
	temp.Epargne.push((isValuable(res.ongoing.Revenue) * 0.2).toFixed(2))
	temp.Epargne.push(((temp.Epargne[0] - isValuable(res.previous.Epargne)) / dayLeft).toFixed(2))
	temp.Epargne.push(((temp.Epargne[1] - isValuable(res.ongoing.Epargne)) / dayLeft).toFixed(2))

	temp.Obligations = [];
	temp.Obligations.push((isValuable(res.previous.Revenue) * 0.5).toFixed(2))
	temp.Obligations.push((isValuable(res.ongoing.Revenue) * 0.5).toFixed(2))
	temp.Obligations.push(((temp.Obligations[0] - isValuable(res.previous.Obligations)) / dayLeft).toFixed(2))
	temp.Obligations.push(((temp.Obligations[1] - isValuable(res.ongoing.Obligations)) / dayLeft).toFixed(2))

	temp.Revenue = [];
	temp.Revenue.push((isValuable(res.previous.Revenue)).toFixed(2))
	temp.Revenue.push((isValuable(res.ongoing.Revenue)).toFixed(2))
	temp.Revenue.push(((isValuable(res.previous.Revenue) - (isValuable(res.previous.Loisirs) + isValuable(res.previous.Epargne) + isValuable(res.previous.Obligations))) / dayLeft).toFixed(2))
	temp.Revenue.push(((isValuable(res.ongoing.Revenue) - (isValuable(res.ongoing.Loisirs) + isValuable(res.ongoing.Epargne) + isValuable(res.ongoing.Obligations))) / dayLeft).toFixed(2))

	res.quotas = temp;
	temp = {};

  	return res;
  }
};

function isValuable (e) {
	if(typeof e == "number")
		return e
	return 0

}













