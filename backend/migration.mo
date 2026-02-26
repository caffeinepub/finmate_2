module {
  type OldActor = { /* old state */ };
  type NewActor = { /* new state */ };

  public func run(old : OldActor) : NewActor {
    // Old and new state are identical since only actor syntax changed
    old;
  };
};
