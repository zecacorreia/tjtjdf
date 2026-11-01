import br.unb.cic.analysis.samples.*;
public class Drv2 { public static void main(String[] a){ switch(a[0]){
 case "ArrayDataFlowSample": ArrayDataFlowSample.main(new String[0]); break;
 case "ArrayIndirectDataFlowSample": ArrayIndirectDataFlowSample.main(new String[0]); break;
 case "DoubleSourceSample": DoubleSourceSample.main(null); break;
 case "ConfluenceWithTransitivitySample": new ConfluenceWithTransitivitySample().foo(); break;
 case "SourceSinkMethodCallSample": new SourceSinkMethodCallSample().foo(); break;
 case "IntraproceduralDataFlow": new IntraproceduralDataFlow().foo(); break;
 case "IntraproceduralIndirectSource": { IntraproceduralIndirectSource o=new IntraproceduralIndirectSource(); o.m(); o.a(); break; }
 case "SourceSinkVariableAttributionSample": new SourceSinkVariableAttributionSample().foo(); break;
 case "SourceSinkVariableAttributionWithAutoIncrement": new SourceSinkVariableAttributionWithAutoIncrement().foo(); break; } } }
