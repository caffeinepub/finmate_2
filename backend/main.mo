import Array "mo:core/Array";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type SpendingLimit = {
    category : Text;
    limit : Float;
  };

  public type UserProfile = {
    name : Text;
    digiPoints : Nat;
    balance : Float;
    spendingLimits : [SpendingLimit];
    bankAccountNumber : ?Text;
  };

  public type Transaction = {
    amount : Float;
    type_ : Text; // "credit" or "debit"
    category : Text;
    timestamp : Int;
    description : Text;
    paymentMethod : Text;
  };

  public type Challenge = {
    id : Nat;
    description : Text;
    targetAmount : Float;
    rewardPoints : Nat;
    completed : Bool;
  };

  public type LeaderboardEntry = {
    user : Principal;
    name : Text;
    points : Nat;
  };

  module Transaction {
    public func compareByTimestamp(t1 : Transaction, t2 : Transaction) : Order.Order {
      Int.compare(t2.timestamp, t1.timestamp);
    };
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let transactions = Map.empty<Principal, List.List<Transaction>>();
  let referPoints = Map.empty<Principal, Nat>();
  let challenges = Map.empty<Principal, List.List<Challenge>>();
  let referrals = Map.empty<Principal, List.List<Principal>>();

  let categories = [
    "grocery",
    "hostel_expense",
    "food",
    "travel",
    "personal",
    "clothing",
    "mobile_recharge",
  ];

  // Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public shared ({ caller }) func setBankAccount(bankAccountNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set bank account");
    };

    let existingProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };

    let updatedProfile = {
      name = existingProfile.name;
      digiPoints = existingProfile.digiPoints;
      balance = existingProfile.balance;
      spendingLimits = existingProfile.spendingLimits;
      bankAccountNumber = ?bankAccountNumber;
    };

    profiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getBankAccount() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get bank account");
    };
    let existingProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };
    existingProfile.bankAccountNumber;
  };

  // Balance operations
  public query ({ caller }) func getCallerBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check balance");
    };
    switch (profiles.get(caller)) {
      case (null) { 0.0 };
      case (?profile) { profile.balance };
    };
  };

  public shared ({ caller }) func updateBalance(newBalance : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update balance");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let updatedProfile = {
          name = profile.name;
          digiPoints = profile.digiPoints;
          balance = newBalance;
          spendingLimits = profile.spendingLimits;
          bankAccountNumber = profile.bankAccountNumber;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  // Transaction operations
  public shared ({ caller }) func addTransaction(transaction : Transaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };

    let existingTransactions = switch (transactions.get(caller)) {
      case (null) { List.empty<Transaction>() };
      case (?list) { list };
    };

    existingTransactions.add(transaction);
    transactions.add(caller, existingTransactions);
  };

  public query ({ caller }) func getTransactions(category : ?Text) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?list) {
        let filtered = list.toArray();
        let sorted = filtered.sort(Transaction.compareByTimestamp);
        switch (category) {
          case (null) { sorted };
          case (?cat) { sorted.filter(func(t) { t.category == cat }) };
        };
      };
    };
  };

  // Spending limits
  public shared ({ caller }) func setSpendingLimit(category : Text, limit : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set spending limits");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let updatedLimits = profile.spendingLimits.filter(func(sl) { sl.category != category });
        let newLimit = { category = category; limit = limit };
        let finalLimits = updatedLimits.concat([newLimit]);

        let updatedProfile = {
          name = profile.name;
          digiPoints = profile.digiPoints;
          balance = profile.balance;
          spendingLimits = finalLimits;
          bankAccountNumber = profile.bankAccountNumber;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getSpendingLimits() : async [SpendingLimit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view spending limits");
    };
    switch (profiles.get(caller)) {
      case (null) { [] };
      case (?profile) { profile.spendingLimits };
    };
  };

  // Digi points operations
  public shared ({ caller }) func addDigiPoints(points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add digi points");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let updatedProfile = {
          name = profile.name;
          digiPoints = profile.digiPoints + points;
          balance = profile.balance;
          spendingLimits = profile.spendingLimits;
          bankAccountNumber = profile.bankAccountNumber;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getDigiPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view digi points");
    };
    switch (profiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.digiPoints };
    };
  };

  // Challenges
  public shared ({ caller }) func createChallenge(description : Text, targetAmount : Float, rewardPoints : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create challenges");
    };

    let existingChallenges = switch (challenges.get(caller)) {
      case (null) { List.empty<Challenge>() };
      case (?list) { list };
    };

    let challengeId = existingChallenges.size();
    let newChallenge : Challenge = {
      id = challengeId;
      description = description;
      targetAmount = targetAmount;
      rewardPoints = rewardPoints;
      completed = false;
    };

    existingChallenges.add(newChallenge);
    challenges.add(caller, existingChallenges);
    challengeId;
  };

  public query ({ caller }) func getChallenges() : async [Challenge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view challenges");
    };
    switch (challenges.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public shared ({ caller }) func completeChallenge(challengeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete challenges");
    };

    switch (challenges.get(caller)) {
      case (null) { Runtime.trap("No challenges found") };
      case (?list) {
        let challengeArray = list.toArray();
        let updatedChallenges = challengeArray.map(func(c : Challenge) : Challenge {
          if (c.id == challengeId) {
            { id = c.id; description = c.description; targetAmount = c.targetAmount; rewardPoints = c.rewardPoints; completed = true };
          } else {
            c;
          };
        });
        challenges.add(caller, List.fromArray<Challenge>(updatedChallenges));
      };
    };
  };

  // Referral system
  public shared ({ caller }) func referUser(referredUser : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can refer others");
    };

    let existingReferrals = switch (referrals.get(caller)) {
      case (null) { List.empty<Principal>() };
      case (?list) { list };
    };

    existingReferrals.add(referredUser);
    referrals.add(caller, existingReferrals);

    let currentPoints = switch (referPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
    referPoints.add(caller, currentPoints + 10);
  };

  public query ({ caller }) func getReferralPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referral points");
    };
    switch (referPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  public query ({ caller }) func getReferrals() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view referrals");
    };
    switch (referrals.get(caller)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  // Leaderboard (accessible to all users)
  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leaderboard");
    };

    let entries = profiles.entries().map(func((principal, profile)) : LeaderboardEntry {
      {
        user = principal;
        name = profile.name;
        points = profile.digiPoints;
      };
    });

    let sorted = entries.toArray().sort(func(a, b) { Nat.compare(b.points, a.points) });

    sorted.map(func(entry) : LeaderboardEntry {
      {
        user = entry.user;
        name = entry.name;
        points = entry.points;
      };
    });
  };

  // Categories (accessible to all including guests)
  public query ({ caller }) func getSupportedCategories() : async [Text] {
    categories;
  };

  // Admin functions
  public query ({ caller }) func getAllUsers() : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    profiles.keys().toArray();
  };

  public shared ({ caller }) func resetUserData(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reset user data");
    };
    profiles.remove(user);
    transactions.remove(user);
    challenges.remove(user);
    referrals.remove(user);
    referPoints.remove(user);
  };
};
