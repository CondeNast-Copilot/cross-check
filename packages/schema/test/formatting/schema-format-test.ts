import { Record, schemaFormat, types } from "@cross-check/schema";
import { ISODate, strip } from "../support";
import { MediumArticle, Related, SimpleArticle } from "../support/records";

QUnit.module("formatting - schemaFormat");

QUnit.test("simple", assert => {
  assert.equal(
    schemaFormat(SimpleArticle),

    strip`
      Record("SimpleArticle", {
        hed: SingleLine().required(),
        dek: Text(),
        body: Text().required()
      }).metadata({
        collectionName: "simple-articles",
        modelName: "simple-article"
      })
    `
  );

  assert.equal(
    schemaFormat(SimpleArticle.draft),

    strip`
      Record("SimpleArticle", {
        hed: Text(),
        dek: Text(),
        body: Text()
      }).metadata({
        collectionName: "simple-articles",
        modelName: "simple-article"
      })
    `
  );
});

QUnit.test("detailed - published", assert => {
  assert.equal(
    schemaFormat(MediumArticle),

    strip`
      Record("MediumArticle", {
        hed: SingleLine().required(),
        dek: Text(),
        body: Text().required(),
        author: Dictionary({
          first: SingleLine(),
          last: SingleLine()
        }),
        issueDate: ISODate(),
        canonicalUrl: Url(),
        tags: List(SingleWord()),
        categories: List(SingleLine()).required(),
        geo: Dictionary({
          lat: Integer().required(),
          long: Integer().required()
        }),
        contributors: List(Dictionary({
          first: SingleLine(),
          last: SingleLine()
        }))
      }).metadata({
        collectionName: "medium-articles",
        modelName: "medium-article"
      })
    `
  );
});

QUnit.test("detailed - draft", assert => {
  assert.equal(
    schemaFormat(MediumArticle.draft),

    strip`
      Record("MediumArticle", {
        hed: Text(),
        dek: Text(),
        body: Text(),
        author: Dictionary({
          first: Text(),
          last: Text()
        }),
        issueDate: ISODate(),
        canonicalUrl: Text(),
        tags: List(Text()),
        categories: List(Text()),
        geo: Dictionary({
          lat: Integer(),
          long: Integer()
        }),
        contributors: List(Dictionary({
          first: Text(),
          last: Text()
        }))
      }).metadata({
        collectionName: "medium-articles",
        modelName: "medium-article"
      })
    `
  );
});

QUnit.test("required dictionaries", assert => {
  const RECORDS = Record("RequiredDictionary", {
    geo: types.Required({ lat: types.Float(), long: types.Float() }),
    author: types
      .Required({
        first: types.SingleLine(),
        last: types.SingleLine()
      })
      .required(),
    date: ISODate()
  });

  assert.equal(
    schemaFormat(RECORDS),

    strip`
      Record("RequiredDictionary", {
        geo: Dictionary({
          lat: Float().required(),
          long: Float().required()
        }),
        author: Dictionary({
          first: SingleLine().required(),
          last: SingleLine().required()
        }).required(),
        date: ISODate()
      })
    `
  );

  assert.equal(
    schemaFormat(RECORDS.draft),

    strip`
      Record("RequiredDictionary", {
        geo: Dictionary({
          lat: Float(),
          long: Float()
        }),
        author: Dictionary({
          first: Text(),
          last: Text()
        }),
        date: ISODate()
      })
    `
  );
});

QUnit.test("relationships", assert => {
  assert.equal(
    schemaFormat(Related),

    strip`
      Record("Related", {
        first: SingleLine(),
        last: Text(),
        person: hasOne(SimpleArticle).required(),
        articles: hasMany(MediumArticle)
      }).metadata({
        collectionName: "related-articles",
        modelName: "related-article"
      })
    `
  );

  assert.equal(
    schemaFormat(Related.draft),

    strip`
      Record("Related", {
        first: Text(),
        last: Text(),
        person: hasOne(SimpleArticle),
        articles: hasMany(MediumArticle)
      }).metadata({
        collectionName: "related-articles",
        modelName: "related-article"
      })
    `
  );
});
