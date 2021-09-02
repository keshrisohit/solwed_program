const anchor = require('@project-serum/anchor');
const assert = require('assert');

describe('wed_program', () => {

  // Configure the client to use the local cluster.
  let provider=anchor.Provider.local()
  anchor.setProvider(provider);
  const program = anchor.workspace.WedProgram;
  const spouse1 = anchor.web3.Keypair.fromSeed(new Uint8Array(["a","b","c","d","a","b","c","d","a","b","c","d","a","b","c","d","a","b","c","d","a","b","c","d","a","b","c","d","a","b","c","d"]))
  const spouse2 = anchor.web3.Keypair.generate()
   const nevermarried = anchor.web3.Keypair.generate()

  
  console.log(spouse1.publicKey)
  console.log(spouse2.publicKey)
  //QmYYUQLZwp93zkKmf2cmYkaFNV78QZ7n2PhFWFBBaQxDgg

  it('Creates spouse1', async () => {
    await program.rpc.create(provider.wallet.publicKey,Buffer.from("QmV2Mb7ePnAxFHGujk9RH5Nvpb3wJrHEp4T2Gb7tfDYgxh____________________", 'utf8'), {
      accounts: {
        myAccount: spouse1.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [spouse1],
      instructions: [await program.account.wedAccount.createInstruction(spouse1)],
    })

    let counterAccount = await program.account.wedAccount.fetch(spouse1.publicKey)
    console.log(spouse1.publicKey)
    console.log(counterAccount)
    // console.log(counterAccount.spouse.toString())
    // console.log(counterAccount.profileData.toString())

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAccount.spouse.equals(spouse1.publicKey))
    assert.ok(counterAccount.count.toNumber() === 0)
  })

  it('Creates  spouse2', async () => {
    await program.rpc.create(provider.wallet.publicKey, Buffer.from("QmV2Mb7ePnAxFHGujk9RH5Nvpb3wJrHEp4T2Gb7tfDYgxh____________________", 'utf8'),{
      accounts: {
        myAccount: spouse2.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [spouse2],
      instructions: [await program.account.wedAccount.createInstruction(spouse2)],
    })

    console.log(spouse2.publicKey)
    let counterAccount = await program.account.wedAccount.fetch(spouse2.publicKey)
    console.log(counterAccount)
    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAccount.spouse.equals(spouse2.publicKey))
    assert.ok(counterAccount.count.toNumber() === 0)
  })

  it('Initiate a marriage by spouse 1', async () => {
    await program.rpc.marry({
      accounts: {
        myAccount: spouse1.publicKey,
        authority: provider.wallet.publicKey,
        spouseAccount: spouse2.publicKey,
      },
    })

    const counterAccount = await program.account.wedAccount.fetch(spouse1.publicKey)
    console.log(spouse1.publicKey)
    console.log(counterAccount)
    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAccount.spouse.equals(spouse2.publicKey))
    assert.ok(counterAccount.count.toNumber() == 1)
  })


  // it('Creates  spouse3', async () => {
  //   await program.rpc.create(provider.wallet.publicKey, {
  //     accounts: {
  //       myAccount: spouse3.publicKey,
  //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //     },
  //     signers: [spouse3],
  //     instructions: [await program.account.wedAccount.createInstruction(spouse3)],
  //   })

  //   console.log(spouse3.publicKey)
  //   let counterAccount = await program.account.wedAccount.fetch(spouse3.publicKey)
  //   console.log(counterAccount)
  //   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  //   assert.ok(counterAccount.spouse.equals(spouse3.publicKey))
  //   assert.ok(counterAccount.count.toNumber() === 0)
  // })
  // it('Initiate a marriage by spouse 1, second initaliztion should fail', async () => {
  //   await program.rpc.marry({
  //     accounts: {
  //       myAccount: spouse1.publicKey,
  //       authority: provider.wallet.publicKey,
  //       spouseAccount: spouse3.publicKey,
  //     },
  //   })

  //   const counterAccount = await program.account.wedAccount.fetch(spouse1.publicKey)
  //   console.log(spouse1.publicKey)
  //   console.log(counterAccount)
  //   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  //   assert.ok(counterAccount.spouse.equals(spouse2.publicKey))
  //   assert.ok(counterAccount.count.toNumber() == 1)
  // })

  it('Initiate marriage by spouse2', async () => {
    await program.rpc.marry({
      accounts: {
        myAccount: spouse2.publicKey,
        authority: provider.wallet.publicKey,
        spouseAccount: spouse1.publicKey,
      },
    })

    const counterAccount = await program.account.wedAccount.fetch(spouse2.publicKey)
    console.log(spouse2.publicKey)
    console.log(counterAccount)

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAccount.spouse.equals(spouse1.publicKey))
    assert.ok(counterAccount.count.toNumber() == 1)
  })

  it('Divorce by spouse1', async () => {
    await program.rpc.divorce({
      accounts: {
        myAccount: spouse1.publicKey,
        authority: provider.wallet.publicKey,
        spouseAccount: spouse2.publicKey,
      },
    })

    const counterAccount = await program.account.wedAccount.fetch(spouse1.publicKey)
    console.log(spouse1.publicKey) 
    console.log(counterAccount)
      assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
      assert.ok(counterAccount.spouse.equals(spouse2.publicKey))
     //  assert.ok(counterAccount.initDivorce.equals(true))
  //   assert.ok(counterAccount.count.toNumber() == 1)
  })

  it('Divorce by spouse2', async () => {
    await program.rpc.divorce({
      accounts: {
        myAccount: spouse2.publicKey,
        authority: provider.wallet.publicKey,
        spouseAccount: spouse1.publicKey,
      },
    })

    const counterAccount = await program.account.wedAccount.fetch(spouse2.publicKey)
    console.log(spouse2.publicKey)
    console.log(counterAccount)
  //   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  //   assert.ok(counterAccount.spouse.equals(counter1.publicKey))
  //  // assert.ok(counterAccount.initDivorce.equals(false))
  //   assert.ok(counterAccount.count.toNumber() == 1)
  })

  it('update ipfs address containg profile data of account', async () => {

    //console.log(Buffer.from("QmV2Mb7ePnAxFHGujk9RH5Nvpb3wJrHEp4T2Gb7tfDYgxh____________________", 'utf8'))
    await program.rpc.update(Buffer.from("QmV2Mb7ePnAxFHGujk9RH5Nvpb3wJrHEp4T2Gb7tfDYgxh____________________", 'utf8'),{
      accounts: {
        myAccount: spouse2.publicKey,
        authority: provider.wallet.publicKey,
      },
    })

    const counterAccount = await program.account.wedAccount.fetch(spouse2.publicKey)
    console.log(counterAccount)
  //  console.log('here')
    //console.log(counterAccount.profileData.toString('utf-8'))
    reconstituted = String.fromCharCode.apply(null, counterAccount.profileData);
    console.log(reconstituted)
  //   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  //   assert.ok(counterAccount.spouse.equals(counter1.publicKey))
  //  // assert.ok(counterAccount.initDivorce.equals(false))
  //   assert.ok(counterAccount.count.toNumber() == 1)
  })



it('Creates nevermarried', async () => {
  await program.rpc.create(provider.wallet.publicKey,Buffer.from("QmV2Mb7ePnAxFHGujk9RH5Nvpb3wJrHEp4T2Gb7tfDYgxh____________________", 'utf8'), {
    accounts: {
      myAccount: nevermarried.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [nevermarried],
    instructions: [await program.account.wedAccount.createInstruction(nevermarried)],
  })

  let counterAccount = await program.account.wedAccount.fetch(nevermarried.publicKey)
  console.log(spouse1.publicKey)
  console.log(counterAccount)
  // console.log(counterAccount.spouse.toString())
  // console.log(counterAccount.profileData.toString())

  assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  assert.ok(counterAccount.spouse.equals(nevermarried.publicKey))
  assert.ok(counterAccount.count.toNumber() === 0)


})

it('Initiate marriage by nevermarried', async () => {
  await program.rpc.marry({
    accounts: {
      myAccount: nevermarried.publicKey,
      authority: provider.wallet.publicKey,
      spouseAccount: spouse2.publicKey,
    },
  })

  const counterAccount = await program.account.wedAccount.fetch(nevermarried.publicKey)
  console.log(nevermarried.publicKey)
  console.log(counterAccount)

  assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
  assert.ok(counterAccount.spouse.equals(spouse2.publicKey))
  assert.ok(counterAccount.count.toNumber() == 1)
})

it('Cancel the marriage', async () => {
  await program.rpc.divorce({
    accounts: {
      myAccount: nevermarried.publicKey,
      authority: provider.wallet.publicKey,
      spouseAccount: spouse2.publicKey,
    },
  })

  const counterAccount = await program.account.wedAccount.fetch(nevermarried.publicKey)
  console.log(nevermarried.publicKey) 
  console.log(counterAccount)
    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey))
    assert.ok(counterAccount.spouse.equals(nevermarried.publicKey))
   //  assert.ok(counterAccount.initDivorce.equals(true))
//   assert.ok(counterAccount.count.toNumber() == 1)
})


});



