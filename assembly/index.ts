import { storage, env, Context } from 'near-sdk-as'

// Data Models Imports
import { WhitelistContract, whitelist, factory_whitelist } from './models'

// Types Imports
import { AccountId } from './types'

// globals
let contract: WhitelistContract


/*********/
/* Main  */
/*********/

export function initContract(foundation_account_id: AccountId): WhitelistContract {
  /// Initializes the contract with the given NEAR foundation account ID.
  assert(!storage.hasKey('init'), 'Already initialized')
  assert(env.isValidAccountID(foundation_account_id), 'The NEAR Foundation account ID is invalid')
  contract = new WhitelistContract(foundation_account_id, whitelist, factory_whitelist)
  storage.set('init', true)
  return contract
}


/***********/
/* Getters */
/***********/

/// Returns `true` if the given staking pool account ID is whitelisted.
export function is_whitelisted(staking_pool_account_id: AccountId): bool {
  _isInit()
  assert(env.isValidAccountID(staking_pool_account_id), 'The given account ID is invalid')
  return whitelist.has(staking_pool_account_id)
}

/// Returns `true` if the given factory contract account ID is whitelisted.
export function is_factory_whitelisted(factory_account_id: AccountId): bool {
  _isInit()
  assert(env.isValidAccountID(factory_account_id), 'The given account ID is invalid')
  return factory_whitelist.has(factory_account_id)
}


/************************/
/* Factory + Foundation */
/************************/

/// Adds the given staking pool account ID to the whitelist.
/// Returns `true` if the staking pool was not in the whitelist before, `false` otherwise.
/// This method can be called either by the NEAR foundation or by a whitelisted factory.
export function add_staking_pool(staking_pool_account_id: AccountId): bool {
  _isInit()
  assert(env.isValidAccountID(staking_pool_account_id), 'The given account ID is invalid')

  // Can only be called by a whitelisted factory or by the foundation.
  if (!factory_whitelist.has(Context.predecessor)){
    _assert_called_by_foundation()
  }
  whitelist.add(staking_pool_account_id)
  return true
}

/**************/
/* Foundation */
/**************/

/// Removes the given staking pool account ID from the whitelist.
/// Returns `true` if the staking pool was present in the whitelist before, `false` otherwise.
/// This method can only be called by the NEAR foundation.
export function remove_staking_pool(staking_pool_account_id: AccountId): bool {
  _isInit()
  _assert_called_by_foundation()
  assert(env.isValidAccountID(staking_pool_account_id), 'The given account ID is invalid')
  whitelist.delete(staking_pool_account_id)
  return true
}

/// Adds the given staking pool factory contract account ID to the factory whitelist.
/// Returns `true` if the factory was not in the whitelist before, `false` otherwise.
/// This method can only be called by the NEAR foundation.
export function add_factory(factory_account_id: AccountId): bool {
  _isInit()
  assert(env.isValidAccountID(factory_account_id), 'The given account ID is invalid')
  _assert_called_by_foundation()
  factory_whitelist.add(factory_account_id)
  return true
}

/// Removes the given staking pool factory account ID from the factory whitelist.
/// Returns `true` if the factory was present in the whitelist before, `false` otherwise.
/// This method can only be called by the NEAR foundation.
export function remove_factory(factory_account_id: AccountId): bool {
  _isInit()
  _assert_called_by_foundation()
  assert(env.isValidAccountID(factory_account_id), 'The given account ID is invalid')
  factory_whitelist.delete(factory_account_id)
  return true
}


/************/
/* Internal */
/************/

function _assert_called_by_foundation(): void {
  assert(Context.predecessor == contract.foundation_account_id, 'Can only be called by NEAR foundation')
}

function _isInit(): void {
  assert(storage.hasKey('init') && storage.getSome<bool>('init') == true, 'The contract should be initialized before usage.')
}