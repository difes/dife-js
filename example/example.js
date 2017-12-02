
var dife = new Dife('YOUR_PUBLIC_TOKEN');

dife.listFeatures(function (response) {

  if (response.data.length > 0) {

    dife.listValues(response.data[0].id, function (values) {

      console.log(values.data);

    }, function () {

      console.log(values.data);
      
    });

  }

}, function (response) {

  console.log(response);

});