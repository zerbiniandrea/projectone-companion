import { getTableColumns, sql, SQL } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { isPresent } from '../utils'

export const takeFirstResult = <T>(results: T[]): T | null =>
    results.length > 0 && isPresent(results[0]) ? results[0] : null

// https://orm.drizzle.team/docs/guides/upsert#postgresql-and-sqlite
export const buildConflictUpdateColumns = <
    T extends PgTable | SQLiteTable,
    Q extends keyof T['_']['columns']
>(
    table: T,
    columns: Q[]
): Record<Q, SQL<unknown>> => {
    const cls = getTableColumns(table)

    return columns.reduce(
        (acc, column) => {
            const colName = cls[column].name
            acc[column] = sql.raw(`excluded.${colName}`)

            return acc
        },
        {} as Record<Q, SQL>
    )
}

// https://github.com/drizzle-team/drizzle-orm/issues/1728#issuecomment-2160176330
export const conflictUpdateAllExcept = <
    T extends SQLiteTable,
    E extends (keyof T['$inferInsert'])[]
>(
    table: T,
    except: E
): Omit<Record<keyof typeof table.$inferInsert, SQL>, E[number]> => {
    const columns = getTableColumns(table)
    const updateColumns = Object.entries(columns).filter(
        ([col]) => !except.includes(col as keyof typeof table.$inferInsert)
    )

    return updateColumns.reduce(
        (acc, [colName, table]) => ({
            ...acc,
            [colName]: sql.raw(`excluded.${table.name}`)
        }),
        {}
    ) as Omit<Record<keyof typeof table.$inferInsert, SQL>, E[number]>
}
