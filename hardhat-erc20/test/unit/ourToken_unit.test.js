const { assert, expect } = require("chai")
const { deployments, getUnnamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("ourToken unit test", () => {
          //Multipler is used to make reading the math easier because of the 18 decimal points
          const multiplier = 10 ** 18
          let deployer, user
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              user = (await getUnnamedAccounts()).user

              await deployments.fixture(["all"])
              const ourToken = await ethers.getContract("OurToken", deployer)
          })

          describe("Constructor", () => {
              it("sets up correct INITIAL_SUPPLY", async () => {
                  const totalSupply = await ourToken.totalSupply()
                  assert.equal(totalSupply.toString(), initialSupply) // INITIAL_SUPPLY==> def???
              })

              it("sets up Symbol", async () => {
                  const symbol = (await ourToken.symbol()).toString()
                  assert.equal(symbol, "DAP")
              })

              it("sets up name", async () => {
                  const name = (await ourToken.name()).toString()
                  assert.equal(name, "DAP")
              })
          })

          describe("Transfer", () => {
              it("Should tranfer token to given address successfully", async () => {
                  const amountToBeTransfered = ethers.utils.parseEther("10")
                  await ourToken.transfer(user, amountToBeTransfered)

                  assert.equal(
                      (await ourToken.balanceOf(user), amountToBeTransfered)
                  )
              })

              it("Should emit an event after successful trancfer", async () => {
                  expect(
                      await ourToken
                          .transfer(user, (multiplier * 10).toString())
                          .to.emit(ourToken, "transfer")
                  )
              })
          })

          describe("Allowance", () => {
              const amount = (20 * multiplier).toString()
              beforeEach(async () => {
                  // needed to keep a track of "balanceOf" token
                  playertoken = await ethers.getContract("OurToken", user)
              })

              it("Should approve other address to spend token", async () => {
                  // 1. hardcoding the spending token
                  const tokenToSpend = ethers.utils.parseEther("5")
                  // 2. Me(deployer) approving user to spend Specified(tokenToSpend) token
                  await ourToken.approve(user, tokenToSpend)
                  // 3. making user as deployer and storing contract in ourToken1
                  const ourToken1 = await ethers.getContract("OurToken", user)
                  await ourToken1.transferFrom(deployer, user, tokenToSpend)
                  expect(await ourToken1.balanceOf(user)).to.equal(tokenToSpend)
              })

              it("Doesn't allow unapproved member to transfer", async () => {
                  //Deployer is approving that user1 can spend 20 of their precious DAP's

                  await expect(
                      playertoken.transferFrom(deployer, user, amount)
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })

              it("Must emit approval after approval occurs ", async () => {
                  await expect(ourToken.approve(user, amount)).to.emit(
                      ourToken,
                      "Approval"
                  )
              })

              it("Correct allowance is being set", async () => {
                  // 1. Approving "User" to use specific "amount"
                  await ourToken.approve(user, amount)
                  //   2. Checking whether the allowance I(deployer) specified is correct or not
                  const allowance = await ourToken.allowance(deployer, user)

                  assert.equal(allowance.toString(), amount)
              })

              it("Won't allow to spend more than allowance allocated", async () => {
                  // 1. Approving "User" to use specific "amount"
                  await ourToken.approve(user, amount)
                  // 2. if "User"try to spend more than allocated value (here 25>20(allocated)) then it should be reverted
                  await expect(
                      playertoken.transferFrom(
                          deployer,
                          user,
                          (25 * multiplier).toString()
                      )
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
          })
      })
