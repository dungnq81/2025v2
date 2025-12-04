<?php

namespace HD\Services\Modules;

use HD\Services\AbstractService;
use HD\Utilities\Traits\Singleton;

\defined( 'ABSPATH' ) || die;

final class Ajax extends AbstractService {
    use Singleton;

    protected function init(): void {}
}
