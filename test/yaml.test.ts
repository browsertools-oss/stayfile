import { describe, test, expect } from 'vitest';
import { yamlToJson, jsonToYaml, csvToYaml } from '../src/lib/yaml';

describe('yamlToJson', () => {
  test('types numbers, booleans and null', () => {
    expect(JSON.parse(yamlToJson('name: Ada\nage: 36\nadmin: false\nnote: ~\n'))).toEqual({
      name: 'Ada', age: 36, admin: false, note: null,
    });
  });
  test('quoted leading zeros stay strings', () => {
    expect(JSON.parse(yamlToJson("zip: '02134'"))).toEqual({ zip: '02134' });
  });
  test('several documents become a JSON array', () => {
    expect(JSON.parse(yamlToJson('a: 1\n---\nb: 2\n'))).toEqual([{ a: 1 }, { b: 2 }]);
  });
  test('a single document stays a single value', () => {
    expect(JSON.parse(yamlToJson('- a\n- b\n'))).toEqual(['a', 'b']);
  });
  test('JSON is valid YAML, so a JSON file converts', () => {
    expect(JSON.parse(yamlToJson('{"a": 1}'))).toEqual({ a: 1 });
  });
  test('invalid YAML says so', () => {
    expect(() => yamlToJson('a: [1, 2\nb: }')).toThrow('Not valid YAML');
  });
  test('an empty file says so', () => {
    expect(() => yamlToJson('   \n')).toThrow('empty');
  });
});

describe('jsonToYaml', () => {
  test('writes block YAML with the keys in order', () => {
    expect(jsonToYaml('{"name": "Ada", "age": 36}')).toBe('name: Ada\nage: 36\n');
  });
  test('round trips through yamlToJson', () => {
    const json = '{"a":[1,2],"b":{"c":true},"d":"text"}';
    expect(JSON.parse(yamlToJson(jsonToYaml(json)))).toEqual(JSON.parse(json));
  });
  test('invalid JSON says so', () => {
    expect(() => jsonToYaml('{oops}')).toThrow('Not valid JSON');
  });
});

describe('csvToYaml', () => {
  test('each record becomes a mapping keyed by the header', () => {
    const out = csvToYaml('name,age\nAda,36\nGrace,85\n');
    expect(out).toBe('- name: Ada\n  age: 36\n- name: Grace\n  age: 85\n');
  });
  test('numbers are typed and leading zeros stay text', () => {
    const out = csvToYaml('name,zip,age\nAda,02134,36\n');
    expect(JSON.parse(yamlToJson(out))).toEqual([{ name: 'Ada', zip: '02134', age: 36 }]);
  });
  test('without a header row the result is a list of lists', () => {
    expect(csvToYaml('Ada,36\nGrace,85\n', { header: false })).toBe('- - Ada\n  - 36\n- - Grace\n  - 85\n');
  });
  test('the separator can be forced', () => {
    const out = csvToYaml('name;age\nAda;36\n', { delimiter: ';' });
    expect(JSON.parse(yamlToJson(out))).toEqual([{ name: 'Ada', age: 36 }]);
  });
  test('an empty file says so', () => {
    expect(() => csvToYaml('   \n')).toThrow('empty');
  });
});
