package quickstart.dataflow;

/**
 * A detected merge conflict: a tainted value flowing from a source
 * statement to a sink statement.
 */
public class Conflict {

    private int sourceLine;
    private int sinkLine;

    public Conflict(int sourceLine, int sinkLine) {
        this.sourceLine = sourceLine;
        this.sinkLine = sinkLine;
    }

    public int getSourceLine() {
        return sourceLine;
    }

    public int getSinkLine() {
        return sinkLine;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Conflict)) return false;
        Conflict that = (Conflict) o;
        return sourceLine == that.sourceLine && sinkLine == that.sinkLine;
    }

    @Override
    public int hashCode() {
        return sourceLine * 31 + sinkLine;
    }

    @Override
    public String toString() {
        return "source(line " + sourceLine + ") => sink(line " + sinkLine + ")";
    }
}
