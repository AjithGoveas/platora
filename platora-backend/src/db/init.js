import fs from 'node:fs';
import path from 'node:path';
import getClient from './index.js';

// Initialize DB schema from sql/schema.sql if present.
// This function safely strips any non-SQL comment lines (like // or code fences)
// and executes the SQL file as a single multi-statement query so that
// functions, views and complex statements are preserved.
export async function initDbSchema() {
  try {
    const schemaPath = path.resolve(process.cwd(), 'sql', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn('Schema file not found at', schemaPath);
      return;
    }

    let sql = fs.readFileSync(schemaPath, 'utf8');
    if (!sql || !sql.trim()) {
      console.warn('Schema file is empty:', schemaPath);
      return;
    }

    // Remove any lines that are not valid SQL (for example generated file headers
    // like `// filepath: ...` or markdown code fences). Leave SQL comments starting
    // with `--` intact because they are valid.
    sql = sql
      .split('\n')
      .filter((ln) => {
        const t = ln.trim();
        if (!t) return true; // keep blank lines
        if (t.startsWith('```')) return false;
        if (t.startsWith('//')) return false; // remove JS-style comments
        return true;
      })
      .join('\n');

    console.log('Initializing database schema from', schemaPath);
    const client = await getClient();
    try {
      // Execute the whole schema in one call; postgres supports multi-statement
      // queries and this preserves function bodies (which may contain semicolons).
      await client.query(sql);
      console.log('Database schema initialized (CREATE/REPLACE statements executed).');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to initialize DB schema:', err && err.message ? err.message : err);
    // Do not throw; allow server to continue starting so that the developer can
    // see logs. If the DB is unreachable, further DB calls will surface errors.
  }
}

export default initDbSchema;

