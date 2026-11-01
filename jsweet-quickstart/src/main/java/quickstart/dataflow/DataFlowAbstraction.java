package quickstart.dataflow;

/**
 * Information kept while traversing the control flow: a tainted
 * variable name paired with the statement where the taint originated.
 */
public class DataFlowAbstraction {

    private String local;
    private Stmt sourceStmt;

    public DataFlowAbstraction(String local, Stmt sourceStmt) {
        this.local = local;
        this.sourceStmt = sourceStmt;
    }

    public String getLocal() {
        return local;
    }

    public Stmt getSourceStmt() {
        return sourceStmt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DataFlowAbstraction)) return false;
        DataFlowAbstraction that = (DataFlowAbstraction) o;
        return local.equals(that.local) && sourceStmt == that.sourceStmt;
    }

    @Override
    public int hashCode() {
        return local.hashCode() * 31 + sourceStmt.hashCode();
    }

    @Override
    public String toString() {
        return "DataFlowAbstraction{" + local + " from " + sourceStmt + "}";
    }
}
