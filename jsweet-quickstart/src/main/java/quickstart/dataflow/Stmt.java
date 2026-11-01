package quickstart.dataflow;

import java.util.List;

/**
 * Stands in for a Soot Unit: one statement in a hand-authored CFG,
 * with the def/use variable names Soot would normally compute from
 * compiled bytecode.
 */
public class Stmt {

    private int line;
    private List<String> defs;
    private List<String> uses;

    public Stmt(int line, List<String> defs, List<String> uses) {
        this.line = line;
        this.defs = defs;
        this.uses = uses;
    }

    public int getLine() {
        return line;
    }

    public List<String> getDefs() {
        return defs;
    }

    public List<String> getUses() {
        return uses;
    }

    @Override
    public String toString() {
        return "line " + line;
    }
}
