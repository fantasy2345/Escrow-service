// material
import {
  Card,
  Paper,
  Container,
  CardHeader,
  CardContent
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Block from '../../components/Block';
import HeaderDashboard from '../../components/HeaderDashboard';
//
import OrderStepper from './OrderStepper';

// ----------------------------------------------------------------------

export default function StepperComponent() {
  return (
    <Page title="New Order">
      <Container maxWidth="lg">
        <HeaderDashboard
          heading="New Order"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Order', href: PATH_DASHBOARD.order.buyerorderlist },
            { name: 'New Order', href: '#' }
          ]}
        />
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Create a new order." />
          <CardContent>
            <OrderStepper />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
