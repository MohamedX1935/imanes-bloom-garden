
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the Garden page which is our main page
  return <Navigate to="/garden" replace />;
};

export default Index;
