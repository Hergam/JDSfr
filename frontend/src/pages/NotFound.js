import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Désolé, la page que vous avez visitée n'existe pas."
      extra={
        <Button type="primary">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      }
    />
  );
}

export default NotFound;
