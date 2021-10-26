import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// redux
import { getAuthorList } from '../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import HeaderDashboard from '../components/HeaderDashboard';
import { UserListHead, AuthorListToolbar } from '../components/user/list';
import AuthorDetailDialog from './AuthorDetailDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'display_name', label: 'Name', alignRight: false },
  { id: 'phoneNumber', label: 'phoneNumber', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'country', label: 'country', alignRight: false },
  { id: 'qualification', label: 'Qualification', alignRight: false },
  { id: 'skills', label: 'Skills', alignRight: false },
  { id: 'isVerified', label: 'isVerified', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>{
        if(_user.display_name != null) {
          return _user.display_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
        } else {
          return false;
        }
         
      }
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AuthorList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { authorList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const modalRef = useRef();

  useEffect(() => {
    dispatch(getAuthorList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = authorList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - authorList.length) : 0;

  const filteredUsers = applySortFilter(
    authorList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  

  const handleMore = function(event, email) {
    // get the review data
    const accessToken = window.localStorage.getItem('accessToken');
    axios.post(
      `${process.env.REACT_APP_API_URL}/review/getall`,{
        email: email
      },
      {
        headers: { Authorization: accessToken }
      }
    ).then((response) => {
      modalRef.current.handleShowModal(response.data.review);
    }).catch((error) => {
    });
  }

  return (
    <Page title="User: List | ESCROW">
      <Container>
        <HeaderDashboard
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' }
          ]}
        />

        <Card>
          <AuthorListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={authorList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        display_name,
                        email,
                        avartar,
                        phoneNumber,
                        country,
                        qualification,
                        skill,
                        isVerified
                      } = row;
                      const isItemSelected = selected != [] && selected.indexOf(id) !== -1;
                      const avatarUrl = process.env.REACT_APP_API_URL + '/' + avartar;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={(event) => handleClick(event, id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Box
                              sx={{
                                py: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Box
                                component={Avatar}
                                alt={display_name}
                                src={avatarUrl}
                                sx={{ mx: 2 }}
                              />
                              <Typography component="span" variant="subtitle2" noWrap>
                                {display_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="left">{phoneNumber}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{country}</TableCell>
                          <TableCell align="left">{qualification}</TableCell>
                          <TableCell align="left">{skill}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={
                                theme.palette.mode === 'light'
                                  ? 'ghost'
                                  : 'filled'
                              }
                              color={
                                (isVerified === 0 && 'error') || 'success'
                              }
                            >
                              {isVerified == 1 ? "Yes" : "No"}
                            </Label>
                          </TableCell>
                          <TableCell align="right" onClick={(event) => {handleMore(event, email)}}>
                            <IconButton>
                              <Icon
                                width={20}
                                height={20}
                                icon={moreVerticalFill}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={authorList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <AuthorDetailDialog ref={modalRef} />
    </Page>
  );
}
