import { u128, PersistentSet } from 'near-sdk-as'

// import Types
import { AccountId } from './types'

// Export persistent storage structures
export const whitelist = new PersistentSet<AccountId>('w')
export const factory_whitelist = new PersistentSet<AccountId>('f')

// Export classes
@nearBindgen
export class WhitelistContract {
    /// The account ID of the NEAR Foundation. It allows to whitelist new staking pool accounts.
    /// It also allows to whitelist new Staking Pool Factories, which can whitelist staking pools.
    foundation_account_id: AccountId;

    /// The whitelisted account IDs of approved staking pool contracts.
    whitelist: PersistentSet<AccountId>;

    /// The whitelist of staking pool factories. Any account from this list can whitelist staking
    /// pools.
    factory_whitelist: PersistentSet<AccountId>;

    constructor(
        foundation_account_id: AccountId,
        whitelist: PersistentSet<AccountId>,
        factory_whitelist: PersistentSet<AccountId>
    ) {
        foundation_account_id = this.foundation_account_id;
        whitelist = this.whitelist;
        factory_whitelist = this.factory_whitelist;
    }
}