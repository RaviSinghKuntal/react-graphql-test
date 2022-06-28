import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";
import { TablePagination } from "@material-ui/core";
import {
  useQuery,
} from "@apollo/client";
import { GET_DATA } from "./gql/Query";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function App() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = useState<string>("");
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_DATA); // Query for getting table data
  const [rows, setRows] = useState(loading ? [] : data.search.nodes);
  if (loading) return <p>Loading ...</p>;
  if (error) return <pre>{error.message}</pre>

  // Function for custom search
  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.search.nodes.filter((row: any) => {
      return row.nameWithOwner.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  // Function for clear search
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.search.nodes.length) : 0;

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  function TableData(): any {
    return (
      <TableContainer>
        <Table className={classes.table} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell><b>{'• Name'}</b></TableCell>
              <TableCell align="right"><b>{'🌟 Stars'}</b></TableCell>
              <TableCell align="right"><b>{'🍴 Forks'}</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.length > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data.search.nodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows ? rows : data.search.nodes).map((row: any, id: any) => (
                <TableRow key={row.nameWithOwner} id={row.nameWithOwner}>
                  <TableCell component="th" scope="row">
                   <a href={row.url} target={"_blank"}>{row.nameWithOwner}</a> 
                  </TableCell>
                  <TableCell align="right">{row.stargazerCount}</TableCell>
                  <TableCell align="right">{row.forkCount}</TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <Paper>
        <SearchBar
          value={searched}
          onChange={(searchVal: any) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        <TableData />
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 40]}
          component="div"
          count={data.search.nodes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
