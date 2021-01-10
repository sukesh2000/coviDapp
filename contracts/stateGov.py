import smartpy as sp

class Storage(sp.Contract):
    def __init__(self):
        self.init(address=sp.address("KT1RcyuZeu6RcoeWDAUSVgUkrReWE2JrNMZh"), vaccineCount=0, hosp=sp.address("KT1RcyuZeu6RcoeWDAUSVgUkrReWE2JrNMZh"), hospReqQ=0)

    @sp.entry_point
    def incCount(self, params):
        self.data.vaccineCount += params.transferVaccine
    
    @sp.entry_point
    def hospReq(self, params):
        self.data.hosp = sp.sender
        self.data.hospReqQ = params.quantity

    @sp.entry_point
    def vaccReq(self, params):
        c = sp.contract(sp.TIntOrNat, address=params.address, entry_point="stateReq").open_some()
        sp.transfer(arg=params.amtVaccine, amount=sp.tez(0), destination=c)
    
    @sp.entry_point
    def transferHosp(self, params):
        c = sp.contract(sp.TIntOrNat, address=params.address, entry_point="processRequest").open_some()
        sp.transfer(arg=params.amtVaccine, amount=sp.tez(0), destination=c)
        self.data.vaccineCount -= params.amtVaccine
        sp.if params.address==self.data.hosp:
            self.data.hosp=sp.address("KT1RcyuZeu6RcoeWDAUSVgUkrReWE2JrNMZh")
            self.data.hospReqQ = 0

@sp.add_test(name="Storage Example")
def test():
    alice = sp.test_account("Alice")
    c1 = Storage()
    scenario = sp.test_scenario()
    scenario.h1("Storage")
    scenario += c1
    scenario += c1.incCount(transferVaccine=20)
    scenario += c1.incCount(transferVaccine=5)
    scenario += c1.hospReq(quantity=10).run(sender=alice.address)
    scenario += c1.vaccReq(address=alice.address, amtVaccine=20)
    scenario += c1.transferHosp(address=alice.address, amtVaccine = 10)