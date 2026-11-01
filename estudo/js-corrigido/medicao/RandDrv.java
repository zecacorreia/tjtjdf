import quickstart.dataflow.*;
import java.nio.file.*; import java.util.*;
public class RandDrv {
  static List<String> parse(String s){ List<String> l=new ArrayList<>(); if(!s.isEmpty()) for(String x: s.split(",")) l.add(x); return l; }
  static List<Integer> ints(String s){ List<Integer> l=new ArrayList<>(); if(!s.isEmpty()) for(String x: s.split(",")) l.add(Integer.valueOf(x)); return l; }
  static String fmt(Set<Conflict> cs){ TreeSet<String> t=new TreeSet<>(); for(Conflict c: cs) t.add(c.toString()); return String.join(",", t); }
  public static void main(String[] a) throws Exception {
    if (a[0].equals("hash")) { System.out.println(new Conflict(100000000,1).hashCode()); return; }
    for (String line : Files.readAllLines(Paths.get(a[0]))) {
      String[] p = line.split(";", -1);
      List<Stmt> cfg = new ArrayList<>();
      for (String st : p[2].split("/")) { String[] q = st.split(":", -1); cfg.add(new Stmt(Integer.parseInt(q[0]), parse(q[1]), parse(q[2]))); }
      MergeConflictDefinition d = new MergeConflictDefinition(ints(p[0]), ints(p[1]));
      Collector.instance().clear(); String t = fmt(new TaintedAnalysis(cfg, d).getConflicts());
      Collector.instance().clear(); String r = fmt(new ReachDefinitionAnalysis(cfg, d).getConflicts());
      System.out.println(t + "|" + r);
    }
  }
}
