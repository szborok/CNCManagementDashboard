/**
 * Initialize Sample Backend Data
 * 
 * This creates sample data matching the backend formats (JSONScanner, ToolManager, ClampingPlateManager)
 * so the dashboard can display realistic information even before importing real backend files.
 */

export function initializeSampleBackendData() {
  // Check if we already have data
  if (localStorage.getItem('jsonScannerResults') || 
      localStorage.getItem('toolManagerResults') || 
      localStorage.getItem('clampingPlateResults')) {
    return; // Don't overwrite existing data
  }

  // Sample JSONScanner results
  const jsonScannerResults = [
    {
      id: 'W5270NS01060A_1762709963189',
      filename: 'W5270NS01060A',
      processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      results: {
        rulesApplied: [
          'AutoCorrectionContour',
          'AutoCorrectionPlane',
          'GunDrill60MinLimit',
          'M110Contour',
          'M110Helical',
          'SingleToolInNC'
        ],
        violations: []
      },
      status: 'passed' as const
    },
    {
      id: 'W5270NS01003A_1762709963190',
      filename: 'W5270NS01003A',
      processedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      results: {
        rulesApplied: [
          'AutoCorrectionContour',
          'M110Contour',
          'SingleToolInNC'
        ],
        violations: [
          {
            rule: 'M110Contour',
            message: 'M110 command found in contour operation',
            location: 'NC: W5270NS01003A1.h, Program: Contour_Plane_1'
          }
        ]
      },
      status: 'warning' as const
    },
    {
      id: 'W5270NS01001A_1762709963191',
      filename: 'W5270NS01001A',
      processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      results: {
        rulesApplied: [
          'AutoCorrectionContour',
          'GunDrill60MinLimit',
          'ReconditionedTool',
          'SingleToolInNC'
        ],
        violations: []
      },
      status: 'passed' as const
    }
  ];

  // Sample ToolManager results
  const toolManagerResults = {
    tools: [
      {
        id: '8400180',
        name: '8400180',
        status: 'in_use' as const,
        isMatrix: true,
        usageTime: 450,
        usageCount: 12,
        projectCount: 3
      },
      {
        id: '8410250',
        name: '8410250',
        status: 'in_use' as const,
        isMatrix: true,
        usageTime: 320,
        usageCount: 8,
        projectCount: 2
      },
      {
        id: '8420300',
        name: '8420300',
        status: 'available' as const,
        isMatrix: true,
        usageTime: 0,
        usageCount: 0,
        projectCount: 0
      },
      {
        id: 'CustomTool_001',
        name: 'CustomTool_001',
        status: 'in_use' as const,
        isMatrix: false,
        usageTime: 180,
        usageCount: 5,
        projectCount: 1
      },
      {
        id: 'CustomTool_002',
        name: 'CustomTool_002',
        status: 'NOT_IN_MATRIX' as const,
        isMatrix: false,
        usageTime: 95,
        usageCount: 3,
        projectCount: 1
      },
      {
        id: '15250400',
        name: '15250400',
        status: 'available' as const,
        isMatrix: true,
        usageTime: 0,
        usageCount: 0,
        projectCount: 0
      },
      {
        id: 'X7620180',
        name: 'X7620180',
        status: 'in_use' as const,
        isMatrix: true,
        usageTime: 275,
        usageCount: 7,
        projectCount: 2
      },
      {
        id: '8201150',
        name: '8201150',
        status: 'available' as const,
        isMatrix: true,
        usageTime: 0,
        usageCount: 0,
        projectCount: 0
      }
    ]
  };

  // Sample ClampingPlateManager results
  const clampingPlateResults = {
    plates: [
      {
        id: 'PL-306268-wgec16',
        plateNumber: '1',
        isLocked: false,
        workHistory: 'A: -4961_061; B: -3725_032/-3823_081/-1825_081/-1823_061',
        workProjects: ['-4961_061', '-3725_032', '-3823_081', '-1825_081', '-1823_061']
      },
      {
        id: 'PL-306268-abc123',
        plateNumber: '10',
        isLocked: true,
        workHistory: 'A: W5270NS01060A; B: W5270NS01003A',
        workProjects: ['W5270NS01060A', 'W5270NS01003A']
      },
      {
        id: 'PL-306268-def456',
        plateNumber: '14',
        isLocked: false,
        workHistory: 'A: -5123_045; B: -4892_071',
        workProjects: ['-5123_045', '-4892_071']
      },
      {
        id: 'PL-306268-ghi789',
        plateNumber: '20',
        isLocked: true,
        workHistory: 'A: W5270NS01001A',
        workProjects: ['W5270NS01001A']
      },
      {
        id: 'PL-306268-jkl012',
        plateNumber: '25',
        isLocked: false,
        workHistory: '',
        workProjects: []
      }
    ]
  };

  // Save to localStorage
  localStorage.setItem('jsonScannerResults', JSON.stringify(jsonScannerResults));
  localStorage.setItem('toolManagerResults', JSON.stringify(toolManagerResults));
  localStorage.setItem('clampingPlateResults', JSON.stringify(clampingPlateResults));

  console.log('✅ Sample backend data initialized');
  console.log(`   📊 JSON Scanner: ${jsonScannerResults.length} results`);
  console.log(`   🔧 Tool Manager: ${toolManagerResults.tools.length} tools`);
  console.log(`   📋 Clamping Plates: ${clampingPlateResults.plates.length} plates`);
}
