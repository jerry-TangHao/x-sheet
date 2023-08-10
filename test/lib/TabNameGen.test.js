import {TabNameGen} from "../../src/lib/TabNameGen";

test('tab name gen 1', () => {
    const nameGen = new TabNameGen()
    expect(nameGen.genName('sheet10')).toEqual('sheet10');
    expect(nameGen.genName()).toEqual('sheet11');
})

test('tab name gen 2', () => {
    const nameGen = new TabNameGen()
    expect(nameGen.genName()).toEqual('sheet1');
    expect(nameGen.genName()).toEqual('sheet2');
})

test('tab name gen 3', () => {
    const nameGen = new TabNameGen()
    expect(nameGen.genName('a')).toEqual('a');
    expect(nameGen.genName('b')).toEqual('b');
})

test('tab name gen 3', () => {
    const nameGen = new TabNameGen()
    expect(nameGen.genName('a')).toEqual('a');
    expect(nameGen.genName('b')).toEqual('b');
    expect(nameGen.genName()).toEqual('sheet1');
})