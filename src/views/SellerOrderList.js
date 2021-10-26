import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { getOrderList, getAllOrderList } from '../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import HeaderDashboard from '../components/HeaderDashboard';
import { UserListHead, UserListToolbar } from '../components/user/list';
import useAuth from '../hooks/useAuth';
import parse from 'html-react-parser';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'or_topic', label: 'Topic', alignRight: false },
  { id: 'or_description', label: 'Description', alignRight: false },
  { id: 'or_price', label: 'Price', alignRight: false },
  { id: 'or_buyerEmail', label: 'Buyer Email', alignRight: false },
  { id: 'or_status', label: 'Status', alignRight: false },
  { id: 'more', label: 'Detail', alignRight: true }
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
    return filter(array, (_user) => {
      if (_user.or_topic != null) {
        return _user.or_topic.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      } else {
        return false;
      }
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function orderList() {
  let history = useHistory();
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  let { orderList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  orderList = orderList === undefined? []: orderList

  if (user.role === 0) {
    useEffect(() => {
      dispatch(getAllOrderList());
    }, [dispatch]);
  } else {
    useEffect(() => {
      dispatch(getOrderList(2));
    }, [dispatch]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleMoreClick = (id) => {
    history.push('/dashboard/order/detail/' + id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const filteredUsers = applySortFilter(
    orderList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Orders | ESCROW">
      <Container>
        <HeaderDashboard
          heading="Orders"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Seller Orders', href: PATH_DASHBOARD.order.sellerorderlist },
            { name: 'List' }
          ]}
        />

        <Card>
          <UserListToolbar
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
                  rowCount={orderList.length}
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
                        or_topic,
                        or_description,
                        or_price,
                        or_buyerEmail,
                        or_status
                      } = row;
                      const isItemSelected =
                        selected != null && selected.indexOf(id) !== -1;
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
                          <TableCell align="left">{or_topic}</TableCell>
                          <TableCell align="left">
                            {parse(or_description)}
                          </TableCell>
                          <TableCell align="left">{or_price}</TableCell>
                          <TableCell align="left">{or_buyerEmail}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={
                                theme.palette.mode === 'light'
                                  ? 'ghost'
                                  : 'filled'
                              }
                              color={
                                (or_status === 'submitted' && 'error') ||
                                'success'
                              }
                            >
                              {or_status}
                            </Label>
                          </TableCell>
                          <TableCell
                            align="right"
                            onClick={(event) => handleMoreClick(id)}
                          >
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
            count={orderList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
