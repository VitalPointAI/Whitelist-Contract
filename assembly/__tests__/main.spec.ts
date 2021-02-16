import { add_staking_pool, initContract, is_whitelisted } from '../index';
import { storage, Context, VMContext } from "near-sdk-as";
import { AccountId } from '../types'
import { whitelist, WhitelistContract } from '../models';

const account_near: AccountId = 'near'
const account_whitelist: AccountId = 'whitelist'
const account_pool: AccountId = 'pool'
const account_factory: AccountId = 'factory'
let contract: WhitelistContract

beforeEach(() => {
    contract = initContract(account_near)
})

describe("WhiteList", () => {
    it("should be initialized", () => {
        expect(storage.getSome<bool>('init')).toBe(true)
    });

    it("should be able to whitelist", () => {
        expect(is_whitelisted(account_pool)).toBe(false)
        add_staking_pool(account_pool)
        expect(is_whitelisted(account_pool)).toBe(true)
        expect(add_staking_pool(account_pool)).toBe(false)
    })
});
