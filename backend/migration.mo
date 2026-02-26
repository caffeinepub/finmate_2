import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldSpendingLimit = {
    category : Text;
    limit : Float;
  };

  type OldUserProfile = {
    name : Text;
    digiPoints : Nat;
    balance : Float;
    spendingLimits : [OldSpendingLimit];
    bankAccountLinked : Bool;
  };

  type OldActor = {
    profiles : Map.Map<Principal, OldUserProfile>;
    referPoints : Map.Map<Principal, Nat>;
    referrals : Map.Map<Principal, List.List<Principal>>;
    categories : [Text];
  };

  type NewSpendingLimit = {
    category : Text;
    limit : Float;
  };

  type NewUserProfile = {
    name : Text;
    digiPoints : Nat;
    balance : Float;
    spendingLimits : [NewSpendingLimit];
    bankAccountNumber : ?Text;
  };

  type NewActor = {
    profiles : Map.Map<Principal, NewUserProfile>;
    referPoints : Map.Map<Principal, Nat>;
    referrals : Map.Map<Principal, List.List<Principal>>;
    categories : [Text];
  };

  // Only convert unsafe field that is changed from Bool -> ?Text
  public func run(old : OldActor) : NewActor {
    let newProfiles = old.profiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldUser) {
        {
          oldUser with
          bankAccountNumber = null;
        };
      }
    );
    { old with profiles = newProfiles };
  };
};
