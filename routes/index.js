var express = require('express');
var faker = require('faker');
var router = express.Router();
var getDB = require("../lib/mongodb").getDB;
var async = require("async");
var ObjectId = require("mongodb").ObjectId;

router.get('/sort', function (req, res, next) {
  req.connection.setTimeout(600000);
  getDB(function(err, db) {
    var cursor = db.collection("customer").aggregate([ {$sort: {amount: 1}} ], {
      allowDiskUse: true,
      cursor: { batchSize: 1 }
    });
    cursor.next(function(err, docs) {
      if (err) {
        console.error(err);
        return res.status(500).json({ok: 0});
      }
      cursor.close();
      res.json({ok: 1});
    });
  });
});

router.get('/insert', function (req, res, next) {
  getDB(function (err, db) {
    var obj = genObj();
    obj._id = new ObjectId();
    db.collection("customer").insert(obj, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ok: 0});
      }
      // res.json(obj);
      res.json({ ok: 1 });
    });
  });
});


router.get('/update', function (req, res, next) {
  getDB(function (err, db) {
    // var obj = genObj();
    db.collection("customer").update({
      _id: ObjectId("57ea3713209365c62a81e7aa")
    }, {
      "$set": {
        zipCode: faker.address.zipCode(),
        findName: faker.name.findName(),
        city: faker.address.city()
      }
    }, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ok: 0});
      }
      res.json({ok: 1});
    });
  });
});

router.get('/reset', function (req, res, next) {
  getDB(function (err, db) {
    async.series([
      function (callback) {
        db.collection("customer").remove({}, function (err) {
          if (err) {
            console.log("reset failed!");
            callback(err);
            return;
          }
          callback(null);
        });
      },
      function (callback) {
        var obj = genObj();
        obj._id = ObjectId("57ea3713209365c62a81e7aa");
        db.collection("customer").insert(obj, function (err) {
          if (err) {
            callback(err);
            return;
          }
          callback(null);
        });
      }
    ], function (err, results) {
      if (err) {
        res.status(500).json({ ok: 0 });
        return;
      }
      res.json({ ok: 1 });
    });
  });
});

function genObj() {
  var obj = {
      zipCode: faker.address.zipCode(),
      city: faker.address.city(),
      cityPrefix: faker.address.cityPrefix(),
      citySuffix: faker.address.citySuffix(),
      streetName: faker.address.streetName(),
      streetAddress: faker.address.streetAddress(),
      streetSuffix: faker.address.streetSuffix(),
      streetPrefix: faker.address.streetPrefix(),
      secondaryAddress: faker.address.secondaryAddress(),
      county: faker.address.county(),
      country: faker.address.country(),
      countryCode: faker.address.countryCode(),
      state: faker.address.state(),
      stateAbbr: faker.address.stateAbbr(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude(),
      color: faker.commerce.color(),
      department: faker.commerce.department(),
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      productAdjective: faker.commerce.productAdjective(),
      productMaterial: faker.commerce.productMaterial(),
      product: faker.commerce.product(),
      suffixes: faker.company.suffixes(),
      companyName: faker.company.companyName(),
      companySuffix: faker.company.companySuffix(),
      catchPhrase: faker.company.catchPhrase(),
      bs: faker.company.bs(),
      catchPhraseAdjective: faker.company.catchPhraseAdjective(),
      catchPhraseDescriptor: faker.company.catchPhraseDescriptor(),
      catchPhraseNoun: faker.company.catchPhraseNoun(),
      bsAdjective: faker.company.bsAdjective(),
      bsBuzz: faker.company.bsBuzz(),
      bsNoun: faker.company.bsNoun(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      findName: faker.name.findName(),
      jobTitle: faker.name.jobTitle(),
      prefix: faker.name.prefix(),
      suffix: faker.name.suffix(),
      title: faker.name.title(),
      jobDescriptor: faker.name.jobDescriptor(),
      jobArea: faker.name.jobArea(),
      jobType: faker.name.jobType(),
      phoneNumber: faker.phone.phoneNumber(),
      phoneNumberFormat: faker.phone.phoneNumberFormat(),
      phoneFormats: faker.phone.phoneFormats(),
      fileName: faker.system.fileName(),
      commonFileName: faker.system.commonFileName(),
      mimeType: faker.system.mimeType(),
      commonFileType: faker.system.commonFileType(),
      commonFileExt: faker.system.commonFileExt(),
      fileType: faker.system.fileType(),
      fileExt: faker.system.fileExt(),
      directoryPath: faker.system.directoryPath(),
      filePath: faker.system.filePath(),
      semver: faker.system.semver(),
      avatar: faker.internet.avatar(),
      email: faker.internet.email(),
      exampleEmail: faker.internet.exampleEmail(),
      userName: faker.internet.userName(),
      protocol: faker.internet.protocol(),
      url: faker.internet.url(),
      domainName: faker.internet.domainName(),
      domainSuffix: faker.internet.domainSuffix(),
      domainWord: faker.internet.domainWord(),
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      mac: faker.internet.mac(),
      password: faker.internet.password(),
      account: faker.finance.account(),
      accountName: faker.finance.accountName(),
      mask: faker.finance.mask(),
      amount: parseFloat(faker.finance.amount()),
      transactionType: faker.finance.transactionType(),
      currencyCode: faker.finance.currencyCode(),
      currencyName: faker.finance.currencyName(),
      currencySymbol: faker.finance.currencySymbol(),
      bitcoinAddress: faker.finance.bitcoinAddress()
    };
    return obj;
}

// var obj = genObj();
module.exports = router;
