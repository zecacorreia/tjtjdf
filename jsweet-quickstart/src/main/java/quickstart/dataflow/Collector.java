package quickstart.dataflow;

import java.util.HashSet;
import java.util.Set;

public class Collector {

    private static Collector instance;
    private Set<Conflict> conflicts = new HashSet<>();

    public static Collector instance() {
        if (instance == null) {
            instance = new Collector();
        }
        return instance;
    }

    public void addConflict(Conflict conflict) {
        conflicts.add(conflict);
    }

    public Set<Conflict> getConflicts() {
        return conflicts;
    }

    public void clear() {
        conflicts = new HashSet<>();
    }
}
