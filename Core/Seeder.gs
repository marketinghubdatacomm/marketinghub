function seedInitialData() {
  const roles = [
    ['Owner', 'Full system access'],
    ['Manager', 'Team and approval management'],
    ['Admin', 'Data administration and user support'],
    ['BDR', 'Lead processing and activity logging'],
    ['Digital Marketing', 'Campaign and portal monitoring'],
    ['Marketing Specialist', 'Project and MOM operations'],
    ['Sales', 'Opportunity handling']
  ];

  const roleSheet = getSheet(SHEETS.MASTER_ROLE);
  if (!roleSheet) throw new Error('Master_Role sheet missing');
  const existing = readSheetRows(SHEETS.MASTER_ROLE).map(row => safeString(row.role_name).toLowerCase());
  roles.forEach(role => {
    if (!existing.includes(role[0].toLowerCase())) {
      appendSheetRow(SHEETS.MASTER_ROLE, [createId('ROL'), role[0], role[1]]);
    }
  });

  const userRows = readSheetRows(SHEETS.MASTER_USER) || [];
  if (userRows.length === 0) {
    appendSheetRow(SHEETS.MASTER_USER, [
      createId('USR'),
      'Administrator',
      'admin@marketinghub.com',
      hashPassword('Admin123!'),
      'Owner',
      'Active',
      nowIso(),
      ''
    ]);
  }
}

function seedDemoLeads() {
  const now = nowIso();
  const leads = [
    [createId('LEA'), createId('COM'), createId('CON'), 'Alice', 'Alice', 'Bob', FUNNEL_STAGE.MQL, LEAD_STATUS.NEW, TEMPERATURE.WARM, 10000, '', 'Demo lead 1', now, ''],
    [createId('LEA'), createId('COM'), createId('CON'), 'Charlie', 'Charlie', 'Dave', FUNNEL_STAGE.SQL, LEAD_STATUS.IN_PROGRESS, TEMPERATURE.HOT, 25000, '', 'Demo lead 2', now, ''],
    [createId('LEA'), createId('COM'), createId('CON'), 'Eve', createId('CON'), 'Frank', FUNNEL_STAGE.OPPORTUNITY, LEAD_STATUS.QUALIFIED, TEMPERATURE.COLD, 50000, '', 'Demo lead 3', now, '']
  ];

  leads.forEach(row => appendSheetRow(SHEETS.TRX_LEAD, row));

  // add a simple source row for each lead
  leads.forEach(row => {
    const leadId = row[0];
    appendSheetRow(SHEETS.TRX_LEAD_SOURCE, [createId('SRC'), leadId, 'Manual', 'Manual', 'TRUE', now]);
  });

  return { success: true, seeded: leads.length };
}
